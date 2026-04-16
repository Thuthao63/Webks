const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Các hàm này phải trùng tên với các hàm trong Controller
router.post('/', reviewController.createReview);
router.get('/:roomId', reviewController.getRoomReviews);
router.get('/', reviewController.getAllReviews); // Lấy toàn bộ đánh giá cho admin
router.delete('/:id', reviewController.deleteReview); // Xóa đánh giá

// FILE ROUTE THÌ MỚI DÙNG DÒNG NÀY:
module.exports = router;