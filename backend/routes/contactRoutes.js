const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Khai báo đường dẫn API cho Contact
router.post('/', contactController.sendContact);            // POST /api/contacts (Dành cho khách gửi form)
router.get('/', verifyToken, isAdmin, contactController.getAllContacts);          // GET /api/contacts (Dành cho Admin xem)
router.put('/:id', verifyToken, isAdmin, contactController.updateContactStatus);  // PUT /api/contacts/:id (Dành cho Admin duyệt)

module.exports = router;