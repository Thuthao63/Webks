const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', serviceController.getAllServices); // Cho phép khách hàng xem dịch vụ
router.post('/', verifyToken, isAdmin, serviceController.createService);
router.put('/:id', verifyToken, isAdmin, serviceController.updateService);
router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

module.exports = router;
