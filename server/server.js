const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Import routes
const authRoutes = require('./routes/auth');
const memesRoutes = require('./routes/memes');
const reactionsRoutes = require('./routes/reactions');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memes', memesRoutes);
app.use('/api/reactions', reactionsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GrokMemeHub API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GrokMemeHub API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login)',
      memes: '/api/memes (GET, POST, PUT, DELETE)',
      reactions: '/api/reactions (GET, POST, DELETE)',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🤖 GrokMemeHub API Server                          ║
║                                                       ║
║   🚀 Server running on port ${PORT}                     ║
║   🌐 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   📍 URL: http://localhost:${PORT}                     ║
║                                                       ║
║   API Endpoints:                                      ║
║   - POST   /api/auth/register                         ║
║   - POST   /api/auth/login                            ║
║   - GET    /api/auth/me                               ║
║   - GET    /api/memes                                 ║
║   - POST   /api/memes                                 ║
║   - POST   /api/memes/upload                          ║
║   - PUT    /api/memes/:id                             ║
║   - DELETE /api/memes/:id                             ║
║   - POST   /api/reactions                             ║
║   - GET    /api/reactions/meme/:memeId                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
