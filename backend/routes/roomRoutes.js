const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const multer = require('multer');
const path = require('path');

// Cấu hình Multer để lưu ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file là thời gian hiện tại để không bị trùng
    }
});
const upload = multer({ storage: storage });

// ==========================================
// ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN (ROUTES)
// ==========================================

// Lấy danh sách
router.get('/', roomController.getAllRooms);
router.get('/types', roomController.getAllRoomTypes);
router.get('/:id', roomController.getRoomById);

// Xóa phòng
router.delete('/:id', roomController.deleteRoom);

// THÊM/SỬA PHÒNG KÈM THEO UPLOAD ẢNH (Từ trang Admin)
router.post('/', upload.single('image'), roomController.createFullRoomInfo);
router.put('/all-info/:id', upload.single('image'), roomController.updateFullRoomInfo);

module.exports = router;