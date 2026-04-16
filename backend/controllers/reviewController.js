const Review = require('../models/Review');
const User = require('../models/User');

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