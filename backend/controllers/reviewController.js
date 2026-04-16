const Review = require('../models/Review');
const User = require('../models/User');
const Room = require('../models/Room');

// ==========================================
// 1. TẠO ĐÁNH GIÁ MỚI
// ==========================================
exports.createReview = async (req, res) => {
    try {
        const { comment, rating, roomId, userId } = req.body;

        if (!comment || !rating || !roomId || !userId) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin đánh giá!" });
        }

        const review = await Review.create({ comment, rating, roomId, userId });

        res.status(201).json({
            message: "Cảm ơn bạn đã để lại đánh giá!",
            review
        });
    } catch (error) {
        console.error("❌ Lỗi tạo đánh giá:", error);
        res.status(500).json({ message: "Lỗi Server khi xử lý đánh giá" });
    }
};

// ==========================================
// 2. LẤY DANH SÁCH ĐÁNH GIÁ CỦA 1 PHÒNG
// ==========================================
exports.getRoomReviews = async (req, res) => {
    try {
        const { roomId } = req.params;

        const reviews = await Review.findAll({
            where: { roomId: roomId },
            include: [
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['id', 'fullName', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Lỗi lấy đánh giá:", error);
        res.status(500).json({ message: "Lỗi Server khi tải danh sách đánh giá" });
    }
};

// ==========================================
// 3. LẤY TOÀN BỘ ĐÁNH GIÁ (Dành cho Admin)
// ==========================================
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, as: 'reviewer', attributes: ['id', 'fullName', 'email'] },
                { model: Room, as: 'room', attributes: ['id', 'roomNumber'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Lỗi lấy tất cả đánh giá:", error);
        res.status(500).json({ message: "Lỗi Server khi tải toàn bộ đánh giá" });
    }
};

// ==========================================
// 4. XÓA ĐÁNH GIÁ (Dành cho Admin)
// ==========================================
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);

        if (!review) return res.status(404).json({ message: "Đánh giá không tồn tại!" });

        await review.destroy();
        res.status(200).json({ message: "Đã xóa đánh giá thành công!" });
    } catch (error) {
        console.error("❌ Lỗi xóa đánh giá:", error);
        res.status(500).json({ message: "Lỗi Server khi xóa đánh giá" });
    }
};