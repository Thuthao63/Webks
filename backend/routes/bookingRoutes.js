const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. Route dành cho khách (POST /api/bookings)
// Đây là dòng để dứt điểm lỗi 404 khi Thảo nhấn "Xác nhận đặt ngay"
router.post('/', bookingController.createBooking);

// 2. Route dành cho Admin/User cập nhật trạng thái
router.put('/:id', bookingController.updateBookingStatus);

// 3. Các route lấy danh sách
router.get('/', bookingController.getAllBookings);
router.get('/user/:userId', bookingController.getUserBookings);

module.exports = router;