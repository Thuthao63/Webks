const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');

// Search requires no auth or maybe admin auth? Since it's global search for admin, 
// let's just make it public for now or use the existing middleware.
// Lấy route GET /api/search
router.get('/', globalSearch);

module.exports = router;
