// controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

function streamUpload(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'jm-organic/products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

// POST /api/uploads — admin only. Accepts one file under field name
// "image", uploads to Cloudinary, returns the short URL.
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await streamUpload(req.file.buffer);
    res.status(201).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

module.exports = { uploadImage };