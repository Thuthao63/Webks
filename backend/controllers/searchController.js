const { Op } = require('sequelize');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const globalSearch = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword || keyword.trim() === '') {
            return res.json({ users: [], rooms: [], bookings: [] });
        }

        const searchPattern = `%${keyword.trim()}%`;

        // 1. Tìm kiếm Users (Admin & Khách hàng)
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { fullName: { [Op.like]: searchPattern } },
                    { email: { [Op.like]: searchPattern } },
                    { phone: { [Op.like]: searchPattern } }
                ]
            },
            attributes: ['id', 'fullName', 'email', 'phone', 'role'],
            limit: 5
        });

        // 2. Tìm kiếm Phòng
        const rooms = await Room.findAll({
            where: {
                roomNumber: { [Op.like]: searchPattern }
            },
            attributes: ['id', 'roomNumber', 'status'],
            limit: 5
        });

        // 3. Tìm kiếm Đơn đặt phòng
        // Có thể tìm theo mã đơn hoặc join với User để tìm theo tên khách
        const bookings = await Booking.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'phone']
            }, {
                model: Room,
                as: 'room',
                attributes: ['roomNumber']
            }],
            where: {
                [Op.or]: [
                    { id: isNaN(keyword) ? null : parseInt(keyword) }, // Tìm ID nếu là số
                    { '$user.fullName$': { [Op.like]: searchPattern } },
                    { '$user.email$': { [Op.like]: searchPattern } },
                    { '$user.phone$': { [Op.like]: searchPattern } },
                    { '$room.roomNumber$': { [Op.like]: searchPattern } }
                ]
            },
            limit: 5
        });

        res.json({
            users,
            rooms,
            bookings
        });

    } catch (error) {
        console.error("Global search error:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi tìm kiếm" });
    }
};

module.exports = {
    globalSearch
};
