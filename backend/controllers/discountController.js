const Discount = require('../models/Discount');
const RoomType = require('../models/RoomType');
const { Op } = require('sequelize');

// 1. Lấy danh sách giảm giá
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.findAll({
            include: [{ model: RoomType, as: 'roomType' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(discounts);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy danh sách giảm giá', error: err.message });
    }
};

// 2. Tạo giảm giá mới
exports.createDiscount = async (req, res) => {
    try {
        const { roomTypeId, discountPercent, startDate, endDate, description } = req.body;
        
        // Kiểm tra xem đã có khuyến mãi nào trùng lặp cho loại phòng này trong khoảng thời gian này chưa
        const existing = await Discount.findOne({
            where: {
                roomTypeId,
                [Op.or]: [
                    {
                        startDate: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        endDate: { [Op.between]: [startDate, endDate] }
                    }
                ]
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Đã có chương trình giảm giá cho loại phòng này trong khoảng thời gian đã chọn.' });
        }

        const discount = await Discount.create({
            roomTypeId,
            discountPercent,
            startDate,
            endDate,
            description
        });
        res.status(201).json(discount);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi tạo giảm giá', error: err.message });
    }
};

// 3. Xóa giảm giá
exports.deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        await Discount.destroy({ where: { id } });
        res.status(200).json({ message: 'Đã xóa giảm giá thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi xóa giảm giá', error: err.message });
    }
};

// 4. Lấy giảm giá đang hoạt động (cho Frontend Client)
exports.getActiveDiscounts = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const discounts = await Discount.findAll({
            where: {
                isActive: true,
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today }
            }
        });
        res.status(200).json(discounts);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy khuyến mãi hiện tại', error: err.message });
    }
};
