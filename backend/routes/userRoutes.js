const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Quản lý người dùng (Dành cho Admin)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
