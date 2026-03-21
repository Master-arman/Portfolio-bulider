const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===== Local Storage for image uploads =====
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp) are allowed!'));
    }
  }
});

// Routes — IMPORTANT: specific routes MUST come before catch-all parameter routes
router.post('/save-portfolio', portfolioController.savePortfolio);
router.get('/download-pdf/:id', portfolioController.downloadPdf);

// Local image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    // Return the URL that can be used to access the image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Catch-all parameter routes LAST
router.get('/:userId', portfolioController.getPortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;
