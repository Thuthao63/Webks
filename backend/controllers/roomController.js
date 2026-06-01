const { Op } = require('sequelize');
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const Booking = require('../models/Booking');

// 1. Lấy tất cả phòng (Có hỗ trợ lọc)
const getAllRooms = async (req, res) => {
    try {
        const { typeId, minPrice, maxPrice, capacity, status, checkInDate, checkOutDate } = req.query;
        
        // Điều kiện lọc cho bảng Rooms
        let whereCondition = {};
        if (status) whereCondition.status = status;
        if (typeId) whereCondition.typeId = typeId;

        // Nếu có khoảng thời gian, tìm các phòng đang bị đặt và loại trừ chúng
        if (checkInDate && checkOutDate) {
            const bookedRooms = await Booking.findAll({
                attributes: ['roomId'],
                where: {
                    status: { [Op.in]: ['pending', 'confirmed'] }, // Chỉ các đơn còn hiệu lực mới chặn phòng
                    [Op.and]: [
                        { checkInDate: { [Op.lt]: new Date(checkOutDate) } },
                        { checkOutDate: { [Op.gt]: new Date(checkInDate) } }
                    ]
                }
            });
            const bookedRoomIds = bookedRooms.map(b => b.roomId);
            if (bookedRoomIds.length > 0) {
                whereCondition.id = { [Op.notIn]: bookedRoomIds };
            }
        }

        // Điều kiện lọc cho bảng RoomType (giá, sức chứa)
        let typeWhereCondition = {};
        if (minPrice && maxPrice) {
            typeWhereCondition.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
        } else if (minPrice) {
            typeWhereCondition.price = { [Op.gte]: Number(minPrice) };
        } else if (maxPrice) {
            typeWhereCondition.price = { [Op.lte]: Number(maxPrice) };
        }

        if (capacity) {
            typeWhereCondition.capacity = { [Op.gte]: Number(capacity) };
        }

        const rooms = await Room.findAll({
            where: whereCondition,
            include: [{ 
                model: RoomType, 
                as: 'roomType',
                where: Object.keys(typeWhereCondition).length > 0 ? typeWhereCondition : undefined
            }]
        });

        // Tự động đồng bộ (Self-healing): Nếu có đơn đang check-in thì phòng phải là Occupied
        const activeBookings = await Booking.findAll({
            where: { status: 'checked_in' },
            attributes: ['roomId']
        });
        const occupiedRoomIds = activeBookings.map(b => b.roomId);

        const processedRooms = rooms.map(r => {
            const roomData = r.toJSON();
            if (occupiedRoomIds.includes(r.id)) {
                roomData.status = 'Occupied';
                // Chữa lỗi database nếu bị lệch
                if (r.status !== 'Occupied') {
                    Room.update({ status: 'Occupied' }, { where: { id: r.id } }).catch(err => console.error("Self-heal lỗi", err));
                }
            } else if (r.status === 'Occupied' && !occupiedRoomIds.includes(r.id)) {
                // Tự động gỡ lỗi: Phòng báo có khách nhưng thực tế không có đơn nào đang ở
                roomData.status = 'Available';
                Room.update({ status: 'Available' }, { where: { id: r.id } }).catch(err => console.error("Self-heal gỡ lỗi", err));
            }
            return roomData;
        });

        res.status(200).json(processedRooms);
    } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
        res.status(500).json({ message: "Lỗi lấy danh sách phòng" });
    }
};

// 2. Lấy chi tiết 1 phòng
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findOne({
            where: { id },
            include: [{ model: RoomType, as: 'roomType' }]
        });
        if (!room) return res.status(404).json({ message: "Không thấy phòng" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy chi tiết phòng" });
    }
};

// 2.5 Lấy các phòng nổi bật
const getFeaturedRooms = async (req, res) => {
    try {
        const featuredRooms = await Room.findAll({
            include: [{ model: RoomType, as: 'roomType' }],
            order: [['createdAt', 'DESC']],
            limit: 4
        });
        res.status(200).json(featuredRooms);
    } catch (error) {
        console.error("Lỗi lấy phòng nổi bật:", error);
        res.status(500).json({ message: "Lỗi lấy phòng nổi bật" });
    }
};

// 3. Lấy tất cả loại phòng (HÀM ĐANG THIẾU NÈ THẢO)
const getAllRoomTypes = async (req, res) => {
    try {
        const types = await RoomType.findAll();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy loại phòng" });
    }
};

// 4. Xóa phòng
const deleteRoom = async (req, res) => {
    try {
        const deleted = await Room.destroy({ where: { id: req.params.id } });
        if (deleted) return res.status(200).json({ message: 'Đã xóa thành công' });
        res.status(404).json({ message: 'Không tìm thấy phòng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa phòng' });
    }
};

// 5. Tạo phòng mới
const createFullRoomInfo = async (req, res) => {
    try {
        const { roomNumber, status, name, price, description, capacity, typeId } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        let finalTypeId = typeId;

        // Nếu người dùng tạo hạng phòng mới (không truyền typeId)
        if (!finalTypeId) {
            const newType = await RoomType.create({
                name, price, description, capacity: capacity || 2, image: imageUrl
            });
            finalTypeId = newType.id;
        }

        const newRoom = await Room.create({
            roomNumber, status: status || 'Available', typeId: finalTypeId
        });

        res.status(201).json({ message: "Thêm thành công", room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm phòng', error: error.message });
    }
};

// 6. Cập nhật phòng
const updateFullRoomInfo = async (req, res) => {
    try {
        const { roomNumber, status, TypeId, name, price, description } = req.body;
        await Room.update({ roomNumber, status }, { where: { id: req.params.id } });
        
        let updateData = { name, price, description };
        if (req.file) updateData.image = req.file.filename;

        await RoomType.update(updateData, { where: { id: TypeId } });
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật' });
    }
};

// --- XUẤT KHẨU TẤT CẢ (ĐẢM BẢO TÊN PHẢI KHỚP VỚI TRÊN) ---
module.exports = {
    getAllRooms,
    getFeaturedRooms,
    getRoomById,
    getAllRoomTypes, // Giờ nó đã được định nghĩa ở mục số 3 rồi nè!
    deleteRoom,
    createFullRoomInfo,
    updateFullRoomInfo
};