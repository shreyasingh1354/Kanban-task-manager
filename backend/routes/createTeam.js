const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');
const { createDefaultLists } = require('./boardRoutes');

const router = express.Router();

// 🏆 Create Team Route
router.post('/create', authenticate, async (req, res) => {
  try {
    // Get user ID from JWT token
    const userId = req.user.id;
    
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }
    
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert into TEAM table
      const teamResult = await client.query(
        'INSERT INTO TEAM (name, created_by) VALUES ($1, $2) RETURNING id, name, created_by, created_at',
        [name, userId]
      );
      
      const team = teamResult.rows[0];
      
      // Add the creator as a team member with 'admin' role
      await client.query(
        'INSERT INTO TEAM_MEMBERS (team_id, user_id, role) VALUES ($1, $2, $3)',
        [team.id, userId, 'admin']
      );
      
      // Create default board
      const boardResult = await client.query(
        'INSERT INTO BOARD (title, team_id) VALUES ($1, $2) RETURNING id',
        ['Main Board', team.id]
      );
      
      
      const boardId = boardResult.rows[0].id;
      
      // Create default lists
      await createDefaultLists(boardId, client);
      
      await client.query('COMMIT');
      
      res.status(201).json({ 
        message: 'Team created successfully with default board and lists', 
        team: team,
        isAdmin: true,
        boardId: boardId
      });
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 Add Team Member Route
router.post('/:teamId/members', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body;
    const requesterId = req.user.id; // Person making the request
    
    // Check if team exists
    const teamCheck = await pool.query('SELECT * FROM TEAM WHERE id = $1', [teamId]);
    
    if (teamCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if requester is admin of this team
    const adminCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, requesterId, 'admin']
    );
    
    if (adminCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Only team admins can add members' });
    }
    
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user already in team
    const memberCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    if (memberCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User is already a team member' });
    }
    
    // Add member
    await pool.query(
      'INSERT INTO TEAM_MEMBERS (team_id, user_id, role) VALUES ($1, $2, $3)',
      [teamId, userId, role || 'member']
    );
    
    res.status(201).json({ 
      message: 'Team member added successfully',
      teamId,
      userId,
      role: role || 'member'
    });
    
  } catch (err) {
    console.error("Add Team Member Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📋 Get User Teams Route
router.get('/user/teams', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT t.id, t.name, t.created_at, tm.role 
       FROM TEAM t
       JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
       WHERE tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );
    
    res.json({ teams: result.rows });
    
  } catch (err) {
    console.error("Get User Teams Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔍 Get Team Members Route
router.get('/:teamId/members', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;
    
    // Check if user is a member of this team
    const memberCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this team' });
    }
    
    // Get all team members with their user info
    const members = await pool.query(
      `SELECT u.id, u.username, u.email, tm.role
       FROM TEAM_MEMBERS tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1
       ORDER BY tm.role = 'admin' DESC`,
      [teamId]
    );
    
    res.json({ members: members.rows });
    
  } catch (err) {
    console.error("Get Team Members Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Get a specific team's details
router.get('/:teamId', authenticate, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Check if the user is a member of the team
    const accessCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: Not a team member' });
    }

    const teamResult = await pool.query(
      'SELECT id, name, created_by, created_at FROM TEAM WHERE id = $1',
      [teamId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ team: teamResult.rows[0] });
  } catch (err) {
    console.error("Get Team By ID Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🚫 Remove Team Member Route
router.delete('/:teamId/members/:userId', authenticate, async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const requesterId = req.user.id;
    
    // Check if requester is team admin
    const adminCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, requesterId, 'admin']
    );
    
    if (adminCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Only team admins can remove members' });
    }
    
    // Check if target user is also an admin
    const targetUserCheck = await pool.query(
      'SELECT * FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    if (targetUserCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User is not a member of this team' });
    }
    
    // Don't allow removing the last admin
    if (targetUserCheck.rows[0].role === 'admin') {
      const adminCount = await pool.query(
        'SELECT COUNT(*) FROM TEAM_MEMBERS WHERE team_id = $1 AND role = $2',
        [teamId, 'admin']
      );
      
      if (adminCount.rows[0].count <= 1) {
        return res.status(400).json({ message: 'Cannot remove the last admin from the team' });
      }
    }
    
    // Remove member
    await pool.query(
      'DELETE FROM TEAM_MEMBERS WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    
    res.json({ message: 'Team member removed successfully' });
    
  } catch (err) {
    console.error("Remove Team Member Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;