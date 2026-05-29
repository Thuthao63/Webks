const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Các hàm này phải trùng tên với các hàm trong Controller
router.post('/', verifyToken, reviewController.createReview);
router.get('/featured', reviewController.getFeaturedReviews);
router.get('/:roomId', reviewController.getRoomReviews);
router.get('/', verifyToken, isAdmin, reviewController.getAllReviews); // Lấy toàn bộ đánh giá cho admin
router.delete('/:id', verifyToken, isAdmin, reviewController.deleteReview); // Xóa đánh giá

// FILE ROUTE THÌ MỚI DÙNG DÒNG NÀY:
module.exports = router;