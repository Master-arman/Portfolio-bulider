const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- LOCAL STORAGE CONFIGURATION ---
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.post('/save-portfolio', portfolioController.savePortfolio);
router.get('/download-pdf/:id', portfolioController.downloadPdf);

// Local image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    // Return the local URL path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Root routes (no ID) — used by frontend context
router.get('/', portfolioController.getPortfolio);
router.delete('/', portfolioController.deletePortfolio);

// Catch-all parameter routes LAST
router.get('/:userId', portfolioController.getPortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;
