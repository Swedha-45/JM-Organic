// middleware/upload.js
const multer = require('multer');

// Held in memory only long enough to stream to Cloudinary — never
// written to disk, nothing to clean up.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

module.exports = upload;