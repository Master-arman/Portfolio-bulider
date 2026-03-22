const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // In production, it's safer to reflect the origin or use a specific domain
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/', (req, res) => {
    res.json({ 
      status: 'running',
      message: 'Portfolio Builder API is running!',
      frontend: 'http://localhost:5173',
      endpoints: {
        auth: '/api/auth',
        portfolio: '/api/portfolio'
      }
    });
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Temporary Database Sync Endpoint (USE ONLY ONCE TO INITIALIZE VERCEL DB)
app.get('/api/sync-db', async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.json({ status: 'success', message: 'Database synchronized successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// Support Vercel startup (conditional listen)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('✅ Database synchronized successfully (with alter).');
      app.listen(PORT, () => console.log(`🚀 Server is running on: http://localhost:${PORT}`));
    })
    .catch((err) => console.error('❌ Database sync error:', err));
}

// Export for Vercel Functions
module.exports = app;