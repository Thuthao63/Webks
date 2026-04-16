const express = require('express');
const router = express.Router();

// Import các Controller
const authController = require('../controllers/authController');

// ==========================================
// 1. ROUTES CHO NGƯỜI DÙNG (AUTH)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verifyOTP);
router.put('/:id', authController.updateUser);

// ==========================================
// 2. ROUTES CHO LIÊN HỆ (CONTACT)
// ==========================================
// Lưu ý: Route này được gọi từ app.use('/api/auth', authRoutes) ở server.js
// Nên link thực tế sẽ là: http://localhost:5000/api/auth/contact


module.exports = router;