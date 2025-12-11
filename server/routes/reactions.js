const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// POST /api/reactions - Add or update reaction (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { meme_id, reaction_type } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!meme_id || !reaction_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide meme_id and reaction_type'
      });
    }

    // Validate reaction type
    const validReactionTypes = ['laugh', 'robot', 'think'];
    if (!validReactionTypes.includes(reaction_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type. Must be one of: laugh, robot, think'
      });
    }

    // Check if meme exists
    const [memes] = await db.query('SELECT id FROM memes WHERE id = ?', [meme_id]);
    if (memes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meme not found'
      });
    }

    // Check if user already reacted to this meme
    const [existingReactions] = await db.query(
      'SELECT id, reaction_type FROM reactions WHERE meme_id = ? AND user_id = ?',
      [meme_id, user_id]
    );

    if (existingReactions.length > 0) {
      // If same reaction, remove it (toggle off)
      if (existingReactions[0].reaction_type === reaction_type) {
        await db.query('DELETE FROM reactions WHERE id = ?', [existingReactions[0].id]);
        return res.json({
          success: true,
          message: 'Reaction removed',
          action: 'removed'
        });
      } else {
        // Update to new reaction type
        await db.query(
          'UPDATE reactions SET reaction_type = ? WHERE id = ?',
          [reaction_type, existingReactions[0].id]
        );
        return res.json({
          success: true,
          message: 'Reaction updated',
          action: 'updated',
          reaction_type
        });
      }
    } else {
      // Insert new reaction
      const [result] = await db.query(
        'INSERT INTO reactions (meme_id, user_id, reaction_type) VALUES (?, ?, ?)',
        [meme_id, user_id, reaction_type]
      );

      res.status(201).json({
        success: true,
        message: 'Reaction added',
        action: 'added',
        reaction_id: result.insertId,
        reaction_type
      });
    }
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding reaction'
    });
  }
});

// GET /api/reactions/meme/:memeId - Get reactions for a meme
router.get('/meme/:memeId', async (req, res) => {
  try {
    const { memeId } = req.params;

    const [reactions] = await db.query(`
      SELECT
        reaction_type,
        COUNT(*) as count
      FROM reactions
      WHERE meme_id = ?
      GROUP BY reaction_type
    `, [memeId]);

    // Format response
    const reactionCounts = {
      laugh: 0,
      robot: 0,
      think: 0
    };

    reactions.forEach(r => {
      reactionCounts[r.reaction_type] = parseInt(r.count);
    });

    res.json({
      success: true,
      meme_id: memeId,
      reactions: reactionCounts,
      total: reactionCounts.laugh + reactionCounts.robot + reactionCounts.think
    });
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reactions'
    });
  }
});

// GET /api/reactions/user/:userId - Get user's reactions (protected)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow users to view their own reactions
    if (req.user.id != userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own reactions'
      });
    }

    const [reactions] = await db.query(`
      SELECT
        r.id,
        r.meme_id,
        r.reaction_type,
        r.created_at,
        m.title as meme_title,
        m.image_url as meme_image
      FROM reactions r
      LEFT JOIN memes m ON r.meme_id = m.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      count: reactions.length,
      reactions
    });
  } catch (error) {
    console.error('Get user reactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reactions'
    });
  }
});

// DELETE /api/reactions/:id - Delete reaction (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if reaction exists and user owns it
    const [reactions] = await db.query('SELECT * FROM reactions WHERE id = ?', [id]);

    if (reactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reaction not found'
      });
    }

    if (reactions[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reactions'
      });
    }

    await db.query('DELETE FROM reactions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Reaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting reaction'
    });
  }
});

module.exports = router;
