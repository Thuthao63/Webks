const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// 1. Khách hàng đặt phòng (Khớp với router.post('/') )
const createBooking = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, totalPrice } = req.body;

        // Thảo lưu ý: Nếu chưa làm Login thì tạm thời gán userId = 1 
        // Nếu đã có Login thì lấy từ req.user.id
        const userId = req.user ? req.user.id : 1;

        const newBooking = await Booking.create({
            roomId,
            userId,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: 'pending' // Chờ duyệt
        });

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
        
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        
        if (status) booking.status = status;
        if (checkOutDate) booking.checkOutDate = checkOutDate;
        if (totalPrice) booking.totalPrice = totalPrice;
        
        await booking.save();

        // Cập nhật trạng thái phòng dựa trên trạng thái đơn
        if (status === 'confirmed') {
            await Room.update({ status: 'Occupied' }, { where: { id: booking.roomId } });
        } else if (status === 'completed' || status === 'cancelled') {
            await Room.update({ status: 'Available' }, { where: { id: booking.roomId } });
        }

        res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
};

// QUAN TRỌNG: Export tất cả để Route nhìn thấy
module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus
};