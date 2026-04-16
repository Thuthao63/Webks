const Service = require('../models/Service');
const BookingService = require('../models/BookingService');

// Lấy danh sách dịch vụ
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(services);
    } catch (error) {
        console.error("❌ Lỗi lấy dịch vụ:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// Tạo dịch vụ mới
exports.createService = async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || isNaN(price)) return res.status(400).json({ message: "Tên và giá hợp lệ là bắt buộc!" });

        const service = await Service.create({ name, price });
        res.status(201).json({ message: "Thêm dịch vụ thành công!", service });
    } catch (error) {
        console.error("❌ Lỗi thêm dịch vụ:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// Cập nhật dịch vụ
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const service = await Service.findByPk(id);
        if (!service) return res.status(404).json({ message: "Dịch vụ không tồn tại!" });

        await service.update({ name, price });
        res.status(200).json({ message: "Cập nhật thành công!", service });
    } catch (error) {
        console.error("❌ Lỗi cập nhật dịch vụ:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// Xóa dịch vụ
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id);
        if (!service) return res.status(404).json({ message: "Dịch vụ không tồn tại!" });

        // Chặn xóa nếu dịch vụ này đã có trong lịch sử đặt phòng
        const count = await BookingService.count({ where: { serviceId: id } });
        if (count > 0) {
            return res.status(400).json({ message: "Không thể xóa dịch vụ này do đã phát sinh trong đơn đặt phòng." });
        }

        await service.destroy();
        res.status(200).json({ message: "Xóa dịch vụ thành công!" });
    } catch (error) {
        console.error("❌ Lỗi xóa dịch vụ:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
};
