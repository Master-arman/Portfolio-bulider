const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (Make sure these are in your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_assets',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Routes — IMPORTANT: specific routes MUST come before catch-all parameter routes
router.post('/save-portfolio', portfolioController.savePortfolio);
router.get('/download-pdf/:id', portfolioController.downloadPdf);

// Local image upload endpoint
    // Local (actually now Cloudinary) image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    // Return the Cloudinary secure URL
    const imageUrl = req.file.path; // CloudinaryStorage stores the URL in req.file.path
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
