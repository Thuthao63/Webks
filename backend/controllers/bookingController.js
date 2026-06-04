const Booking = require('../models/Booking');
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const User = require('../models/User');
const BookingService = require('../models/BookingService');
const { sendInvoiceEmail } = require('../utils/emailService');
const { Op } = require('sequelize');

// 1. Khách hàng đặt phòng (Khớp với router.post('/') )
const createBooking = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, totalPrice, serviceIds, services } = req.body;

        const userId = req.user ? req.user.id : 1;

        // Kiểm tra xem phòng có bị trùng lịch không
        const conflictingBooking = await Booking.findOne({
            where: {
                roomId,
                status: { [Op.in]: ['pending', 'confirmed'] },
                [Op.and]: [
                    { checkInDate: { [Op.lt]: new Date(checkOutDate) } },
                    { checkOutDate: { [Op.gt]: new Date(checkInDate) } }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: "Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác." });
        }

        const newBooking = await Booking.create({
            roomId,
            userId,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: 'pending' // Chờ duyệt
        });

        // Nếu có dịch vụ đi kèm, lưu vào bảng BookingService
        // Hỗ trợ cả định dạng cũ (serviceIds) và định dạng mới (services: [{serviceId, quantity}])
        if (services && Array.isArray(services) && services.length > 0) {
            const bookingServices = services.map(s => ({
                bookingId: newBooking.id,
                serviceId: s.serviceId,
                quantity: s.quantity || 1
            }));
            await BookingService.bulkCreate(bookingServices);
        } else if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
            const bookingServices = serviceIds.map(serviceId => ({
                bookingId: newBooking.id,
                serviceId: serviceId,
                quantity: 1
            }));
            await BookingService.bulkCreate(bookingServices);
        }

        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Lỗi đặt phòng:", error);
        res.status(500).json({ message: "Không thể khởi tạo đơn hàng", error: error.message });
    }
};

// 2. Lấy lịch sử đặt phòng của 1 User
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.findAll({
            where: { userId },
            include: [{ model: Room, as: 'room' }]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy lịch sử" });
    }
};

// 3. Admin lấy tất cả đơn hàng
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['fullName', 'email'] },
                { model: Room, as: 'room' }
            ]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn" });
    }
};

// 4. Admin cập nhật trạng thái đơn (Duyệt/Hủy) hoặc Gia hạn phòng
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, checkOutDate, totalPrice } = req.body;

        const booking = await Booking.findByPk(id, {
            include: [
                { model: User, as: 'user' },
                { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }
            ]
        });
        if (!booking) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

        const oldStatus = booking.status;

        if (status) booking.status = status;
        if (checkOutDate) booking.checkOutDate = checkOutDate;
        if (totalPrice) booking.totalPrice = totalPrice;

        await booking.save();

        // Cập nhật trạng thái phòng dựa trên trạng thái đơn
        if (status === 'checked_in') {
            await Room.update({ status: 'Occupied' }, { where: { id: booking.roomId } });
        } else if (status === 'completed' || status === 'cancelled') {
            await Room.update({ status: 'Available' }, { where: { id: booking.roomId } });
        }

        if (status === 'confirmed') {
            // Nếu từ pending -> confirmed (mới thanh toán xong)
            if (oldStatus !== 'confirmed') {
                if (booking.user && booking.user.email) {
                    sendInvoiceEmail(booking.user.email, booking).catch(err => console.error("Lỗi gửi email ngầm", err));
                }

                // [TÍNH NĂNG REAL-TIME] Bắn thông báo về cho Admin!
                if (req.io) {
                    req.io.emit('newBooking', {
                        id: booking.id,
                        customerName: booking.user?.fullName || 'Khách hàng',
                        roomNumber: booking.room?.roomNumber || 'N/A',
                        prepaidAmount: (booking.totalPrice / 2) // Giả định cọc 50%
                    });
                }
            }
        }

        res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error("Lỗi updateBookingStatus:", error);
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
};

// 5. Lễ tân tạo đơn cho Khách Vãng Lai tại quầy (Walk-in)
const createWalkInBooking = async (req, res) => {
    try {
        const { guestName, guestPhone, guestEmail, roomId, checkInDate, checkOutDate, totalPrice } = req.body;

        if (!guestPhone || !guestEmail) {
            return res.status(400).json({ message: "Vui lòng cung cấp số điện thoại và email để liên hệ." });
        }

        // 1. Kiểm tra xem User với email này đã tồn tại chưa, nếu chưa thì tạo mới
        let walkInUser = await User.findOne({ where: { email: guestEmail } });
        if (!walkInUser) {
            walkInUser = await User.create({
                fullName: guestName || 'Khách vãng lai',
                phone: guestPhone,
                email: guestEmail,
                password: 'walkin_password', // Không quan trọng
                role: 'user'
            });
        }

        // 2. Kiểm tra trùng lịch
        const conflictingBooking = await Booking.findOne({
            where: {
                roomId,
                status: { [Op.in]: ['pending', 'confirmed'] },
                [Op.and]: [
                    { checkInDate: { [Op.lt]: new Date(checkOutDate) } },
                    { checkOutDate: { [Op.gt]: new Date(checkInDate) } }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: "Phòng đã có người đặt trong thời gian này." });
        }

        // 3. Khởi tạo đơn đặt phòng (Confirmed ngay lập tức vì tạo tại quầy)
        const newBooking = await Booking.create({
            roomId,
            userId: walkInUser.id,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: 'confirmed'
        });

        // 4. Đổi trạng thái phòng thành Occupied
        await Room.update({ status: 'Occupied' }, { where: { id: roomId } });

        // 5. Lấy lại Booking kèm thông tin chi tiết và Gửi Email Xác Nhận
        const bookingWithDetails = await Booking.findByPk(newBooking.id, {
            include: [
                { model: User, as: 'user' },
                { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }
            ]
        });

        if (bookingWithDetails && bookingWithDetails.user && bookingWithDetails.user.email) {
            sendInvoiceEmail(bookingWithDetails.user.email, bookingWithDetails).catch(err => console.error("Lỗi gửi email ngầm", err));
        }

        res.status(201).json(bookingWithDetails || newBooking);
    } catch (error) {
        console.error("Lỗi tạo đơn tại quầy:", error);
        res.status(500).json({ message: "Không thể tạo đơn tại quầy", error: error.message });
    }
};

// QUAN TRỌNG: Export tất cả để Route nhìn thấy
module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    createWalkInBooking
};