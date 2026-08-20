// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;