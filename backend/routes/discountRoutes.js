const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

// Quản lý giảm giá (Admin)
router.get('/', discountController.getAllDiscounts);
router.post('/', discountController.createDiscount);
router.delete('/:id', discountController.deleteDiscount);

// Cho khách hàng
router.get('/active', discountController.getActiveDiscounts);

module.exports = router;
