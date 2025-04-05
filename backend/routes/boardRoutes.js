const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Create a new board
router.post('/create', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, teamId } = req.body;
    
    if (!title || !teamId) {
      return res.status(400).json({ message: 'Board title and team ID are required' });
    }
    
    // Check if user is member of this team
    const memberCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'You must be a team member to create a board' });
    }
    
    // Create board
    const boardResult = await pool.query(
      'INSERT INTO BOARD (title, team_id, created_by) VALUES ($1, $2, $3) RETURNING id, title, team_id, created_by',
      [title, teamId, userId]
    );
    
    const board = boardResult.rows[0];
    
    res.status(201).json({
      message: 'Board created successfully',
      board
    });
    
  } catch (err) {
    console.error("Create Board Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boards for a team
router.get('/team/:teamId', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;
    
    // Check if user is member of this team
    const memberCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this team' });
    }
    
    // Get boards
    const boardsResult = await pool.query(
      'SELECT * FROM BOARD WHERE team_id = $1 ORDER BY id ASC',
      [teamId]
    );
    
    res.json({ boards: boardsResult.rows });
    
  } catch (err) {
    console.error("Get Team Boards Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to create default lists for a board
const createDefaultLists = async (boardId, client) => {
  const defaultLists = [
    { title: 'To Do'},
    { title: 'In Progress'},
    { title: 'Completed'}
  ];
  
  for (const list of defaultLists) {
    await client.query(
      'INSERT INTO LIST (title, board_id) VALUES ($1, $2)',
      [list.title, boardId]
    );
  }
};

module.exports = { router, createDefaultLists };