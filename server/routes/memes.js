const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meme-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// GET /api/memes - Get all memes with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, category, sort = 'latest' } = req.query;

    let query = `
      SELECT
        m.id,
        m.title,
        m.caption,
        m.image_url,
        m.category,
        m.created_at,
        u.id as uploader_id,
        u.username as uploader_name,
        COUNT(DISTINCT r.id) as total_reactions,
        SUM(CASE WHEN r.reaction_type = 'laugh' THEN 1 ELSE 0 END) as laugh_count,
        SUM(CASE WHEN r.reaction_type = 'robot' THEN 1 ELSE 0 END) as robot_count,
        SUM(CASE WHEN r.reaction_type = 'think' THEN 1 ELSE 0 END) as think_count
      FROM memes m
      LEFT JOIN users u ON m.uploader_id = u.id
      LEFT JOIN reactions r ON m.id = r.meme_id
    `;

    const conditions = [];
    const params = [];

    // Add search filter
    if (search) {
      conditions.push('(m.title LIKE ? OR m.caption LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add category filter
    if (category && category !== 'all') {
      conditions.push('m.category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY m.id, u.id, u.username';

    // Add sorting
    if (sort === 'trending') {
      query += ' ORDER BY total_reactions DESC, m.created_at DESC';
    } else {
      query += ' ORDER BY m.created_at DESC';
    }

    query += ' LIMIT 50';

    const [memes] = await db.query(query, params);

    // Format the response
    const formattedMemes = memes.map(meme => ({
      id: meme.id,
      title: meme.title,
      caption: meme.caption,
      image: meme.image_url,
      category: meme.category,
      created_at: meme.created_at,
      uploader: {
        id: meme.uploader_id,
        username: meme.uploader_name
      },
      reactions: {
        laugh: parseInt(meme.laugh_count) || 0,
        robot: parseInt(meme.robot_count) || 0,
        think: parseInt(meme.think_count) || 0
      },
      totalReactions: parseInt(meme.total_reactions) || 0
    }));

    res.json({
      success: true,
      count: formattedMemes.length,
      memes: formattedMemes
    });
  } catch (error) {
    console.error('Get memes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching memes'
    });
  }
});

// GET /api/memes/:id - Get single meme
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [memes] = await db.query(`
      SELECT
        m.*,
        u.username as uploader_name,
        COUNT(DISTINCT r.id) as total_reactions
      FROM memes m
      LEFT JOIN users u ON m.uploader_id = u.id
      LEFT JOIN reactions r ON m.id = r.meme_id
      WHERE m.id = ?
      GROUP BY m.id
    `, [id]);

    if (memes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    res.json({
      success: true,
      meme: memes[0]
    });
  } catch (error) {
    console.error('Get meme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meme'
    });
  }
});

// POST /api/memes - Create new meme (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, caption, image_url, category } = req.body;
    const uploader_id = req.user.id;

    // Validate input
    if (!title || !caption || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, caption, and category'
      });
    }

    // Validate caption length (max 140 characters)
    if (caption.length > 140) {
      return res.status(400).json({
        success: false,
        message: 'Caption must be 140 characters or less'
      });
    }

    // Validate category
    const validCategories = ['AI', 'Grok', 'xAI', 'Futuristic'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: AI, Grok, xAI, Futuristic'
      });
    }

    // Use provided image_url or default placeholder
    const finalImageUrl = image_url || 'https://images.unsplash.com/photo-1644325349124-d1756b79dd42?w=1080&q=80';

    // Insert meme
    const [result] = await db.query(
      'INSERT INTO memes (title, caption, image_url, category, uploader_id) VALUES (?, ?, ?, ?, ?)',
      [title, caption, finalImageUrl, category, uploader_id]
    );

    // Fetch the created meme
    const [newMeme] = await db.query(`
      SELECT m.*, u.username as uploader_name
      FROM memes m
      LEFT JOIN users u ON m.uploader_id = u.id
      WHERE m.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Meme created successfully',
      meme: newMeme[0]
    });
  } catch (error) {
    console.error('Create meme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating meme'
    });
  }
});

// POST /api/memes/upload - Upload meme with file (protected)
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, caption, category } = req.body;
    const uploader_id = req.user.id;

    if (!title || !caption || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, caption, category, and image file'
      });
    }

    // Create image URL (in production, use proper domain)
    const image_url = `/uploads/${req.file.filename}`;

    const [result] = await db.query(
      'INSERT INTO memes (title, caption, image_url, category, uploader_id) VALUES (?, ?, ?, ?, ?)',
      [title, caption, image_url, category, uploader_id]
    );

    const [newMeme] = await db.query('SELECT * FROM memes WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Meme uploaded successfully',
      meme: newMeme[0]
    });
  } catch (error) {
    console.error('Upload meme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading meme'
    });
  }
});

// PUT /api/memes/:id - Update meme (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, caption, category } = req.body;
    const userId = req.user.id;

    // Check if meme exists and user owns it
    const [memes] = await db.query('SELECT * FROM memes WHERE id = ?', [id]);

    if (memes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    if (memes[0].uploader_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own memes'
      });
    }

    // Update meme
    await db.query(
      'UPDATE memes SET title = ?, caption = ?, category = ? WHERE id = ?',
      [title, caption, category, id]
    );

    const [updatedMeme] = await db.query('SELECT * FROM memes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Meme updated successfully',
      meme: updatedMeme[0]
    });
  } catch (error) {
    console.error('Update meme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meme'
    });
  }
});

// DELETE /api/memes/:id - Delete meme (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if meme exists and user owns it
    const [memes] = await db.query('SELECT * FROM memes WHERE id = ?', [id]);

    if (memes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    if (memes[0].uploader_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own memes'
      });
    }

    // Delete meme (reactions will be deleted automatically due to CASCADE)
    await db.query('DELETE FROM memes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Meme deleted successfully'
    });
  } catch (error) {
    console.error('Delete meme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting meme'
    });
  }
});

// GET /api/memes/user/:userId - Get memes by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [memes] = await db.query(`
      SELECT
        m.*,
        COUNT(DISTINCT r.id) as total_reactions,
        SUM(CASE WHEN r.reaction_type = 'laugh' THEN 1 ELSE 0 END) as laugh_count,
        SUM(CASE WHEN r.reaction_type = 'robot' THEN 1 ELSE 0 END) as robot_count,
        SUM(CASE WHEN r.reaction_type = 'think' THEN 1 ELSE 0 END) as think_count
      FROM memes m
      LEFT JOIN reactions r ON m.id = r.meme_id
      WHERE m.uploader_id = ?
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      count: memes.length,
      memes: memes.map(meme => ({
        ...meme,
        reactions: {
          laugh: parseInt(meme.laugh_count) || 0,
          robot: parseInt(meme.robot_count) || 0,
          think: parseInt(meme.think_count) || 0
        }
      }))
    });
  } catch (error) {
    console.error('Get user memes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user memes'
    });
  }
});

module.exports = router;
