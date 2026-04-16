const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. Route dành cho khách (POST /api/bookings)
// Thêm verifyToken để lấy được req.user khi đặt phòng
router.post('/', verifyToken, bookingController.createBooking);

// 2. Route dành cho Admin/User cập nhật trạng thái
router.put('/:id', verifyToken, bookingController.updateBookingStatus);

// 3. Các route lấy danh sách
router.get('/', verifyToken, bookingController.getAllBookings);
router.get('/user/:userId', verifyToken, bookingController.getUserBookings);

module.exports = router;