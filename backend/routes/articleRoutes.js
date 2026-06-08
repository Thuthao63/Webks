const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Không cần auth cho khách xem bài viết
router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);

router.post('/', upload.single('thumbnail'), articleController.createArticle);
router.put('/:id', upload.single('thumbnail'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
