const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Các hàm này phải trùng tên với các hàm trong Controller
router.post('/', reviewController.createReview);
router.get('/:roomId', reviewController.getRoomReviews);

// FILE ROUTE THÌ MỚI DÙNG DÒNG NÀY:
module.exports = router;