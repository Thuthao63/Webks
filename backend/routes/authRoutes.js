const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Import các Controller
const authController = require('../controllers/authController');

// ==========================================
// 1. ROUTES CHO NGƯỜI DÙNG (AUTH)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verifyOTP);
router.put('/:id', verifyToken, authController.updateUser);

// Đổi mật khẩu
router.put('/:id/password', verifyToken, authController.changePassword);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ==========================================
// 2. ROUTES CHO LIÊN HỆ (CONTACT)
// ==========================================
// Lưu ý: Route này được gọi từ app.use('/api/auth', authRoutes) ở server.js
// Nên link thực tế sẽ là: http://localhost:5000/api/auth/contact


module.exports = router;