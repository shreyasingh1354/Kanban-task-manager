const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Add comment to task
router.post('/create', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, content } = req.body;
    
    if (!taskId || !content) {
      return res.status(400).json({ message: 'Task ID and comment content are required' });
    }
    
    // Check if task exists and user has access
    const taskCheck = await pool.query(
      `SELECT t.* FROM TASK t
       JOIN LIST l ON t.list_id = l.id
       JOIN BOARD b ON l.board_id = b.id
       JOIN TEAM tm ON b.team_id = tm.id
       JOIN TEAM_MEMBERS tmm ON tm.id = tmm.team_id
       WHERE t.id = $1 AND tmm.user_id = $2`,
      [taskId, userId]
    );
    
    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Task not found or access denied' });
    }
    
    // Create comment
    const commentResult = await pool.query(
      'INSERT INTO COMMENT (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, task_id, user_id, content',
      [taskId, userId, content]
    );
    
    // Get username for response
    const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    
    const comment = {
      ...commentResult.rows[0],
      username: userResult.rows[0].username
    };
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
    
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a task
router.get('/task/:taskId', authenticate, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    
    // Check if user has access to task
    const taskCheck = await pool.query(
      `SELECT t.* FROM TASK t
       JOIN LIST l ON t.list_id = l.id
       JOIN BOARD b ON l.board_id = b.id
       JOIN TEAM tm ON b.team_id = tm.id
       JOIN TEAM_MEMBERS tmm ON tm.id = tmm.team_id
       WHERE t.id = $1 AND tmm.user_id = $2`,
      [taskId, userId]
    );
    
    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Task not found or access denied' });
    }
    
    // Get comments with user info
    const commentsResult = await pool.query(
      `SELECT c.*, u.username 
       FROM COMMENT c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.id ASC`,
      [taskId]
    );
    
    res.json({ comments: commentsResult.rows });
    
  } catch (err) {
    console.error("Get Task Comments Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;