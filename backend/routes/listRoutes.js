const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Create a new list
router.post('/create', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, boardId, position } = req.body;
    
    if (!title || !boardId) {
      return res.status(400).json({ message: 'List title and board ID are required' });
    }
    
    // Check if board exists and user has access
    const boardCheck = await pool.query(
      `SELECT b.* FROM BOARD b
       JOIN TEAM t ON b.team_id = t.id
       JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
       WHERE b.id = $1 AND tm.user_id = $2`,
      [boardId, userId]
    );
    
    if (boardCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Board not found or access denied' });
    }
    
    // Get max position if not provided
    let listPosition = position;
    if (listPosition === undefined) {
      const posResult = await pool.query(
        'SELECT COALESCE(MAX(position) + 1, 0) as new_pos FROM LIST WHERE board_id = $1',
        [boardId]
      );
      listPosition = posResult.rows[0].new_pos;
    }
    
    // Create list
    const listResult = await pool.query(
      'INSERT INTO LIST (title, board_id, position) VALUES ($1, $2, $3) RETURNING id, title, board_id, position',
      [title, boardId, listPosition]
    );
    
    res.status(201).json({
      message: 'List created successfully',
      list: listResult.rows[0]
    });
    
  } catch (err) {
    console.error("Create List Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lists for a board
router.get('/board/:boardId', authenticate, async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.id;
    
    // Check if user has access to board
    const boardCheck = await pool.query(
      `SELECT b.* FROM BOARD b
       JOIN TEAM t ON b.team_id = t.id
       JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
       WHERE b.id = $1 AND tm.user_id = $2`,
      [boardId, userId]
    );
    
    if (boardCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Board not found or access denied' });
    }
    
    // Get lists
    const listsResult = await pool.query(
      'SELECT * FROM LIST WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );
    
    res.json({ lists: listsResult.rows });
    
  } catch (err) {
    console.error("Get Board Lists Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;