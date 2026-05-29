const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Quản lý giảm giá (Admin)
router.get('/', verifyToken, isAdmin, discountController.getAllDiscounts);
router.post('/', verifyToken, isAdmin, discountController.createDiscount);
router.delete('/:id', verifyToken, isAdmin, discountController.deleteDiscount);

// Cho khách hàng
router.get('/active', discountController.getActiveDiscounts);

module.exports = router;
