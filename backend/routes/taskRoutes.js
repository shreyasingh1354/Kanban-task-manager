const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Create a new task
router.post('/create', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, listId, assignedTo, priority, status } = req.body;
    
    if (!title || !listId) {
      return res.status(400).json({ message: 'Task title and list ID are required' });
    }
    
    // Check if list exists and user has access
    const listCheck = await pool.query(
      `SELECT l.* FROM LIST l
       JOIN BOARD b ON l.board_id = b.id
       JOIN TEAM t ON b.team_id = t.id
       JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
       WHERE l.id = $1 AND tm.user_id = $2`,
      [listId, userId]
    );
    
    if (listCheck.rows.length === 0) {
      return res.status(403).json({ message: 'List not found or access denied' });
    }
    
    // Create task
    const taskResult = await pool.query(
      `INSERT INTO TASK (title, description, list_id, created_by, assigned_to, priority, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, title, description, list_id, created_by, assigned_to, priority, status`,
      [title, description || null, listId, userId, assignedTo || null, priority || 'medium', status || 'new']
    );
    
    res.status(201).json({
      message: 'Task created successfully',
      task: taskResult.rows[0]
    });
    
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a list
router.get('/list/:listId', authenticate, async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.user.id;
    
    // Check if user has access to list
    const listCheck = await pool.query(
      `SELECT l.* FROM LIST l
       JOIN BOARD b ON l.board_id = b.id
       JOIN TEAM t ON b.team_id = t.id
       JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
       WHERE l.id = $1 AND tm.user_id = $2`,
      [listId, userId]
    );
    
    if (listCheck.rows.length === 0) {
      return res.status(403).json({ message: 'List not found or access denied' });
    }
    
    // Get tasks
    const tasksResult = await pool.query(
      `SELECT t.*, u.username as assigned_username 
       FROM TASK t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.list_id = $1
       ORDER BY t.id ASC`,
      [listId]
    );
    
    res.json({ tasks: tasksResult.rows });
    
  } catch (err) {
    console.error("Get List Tasks Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:taskId', authenticate, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { title, description, listId, assignedTo, priority, status } = req.body;
    
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
    
    const currentTask = taskCheck.rows[0];
    
    // Update task
    const taskResult = await pool.query(
      `UPDATE TASK SET 
       title = $1,
       description = $2,
       list_id = $3,
       assigned_to = $4,
       priority = $5,
       status = $6
       WHERE id = $7
       RETURNING id, title, description, list_id, created_by, assigned_to, priority, status`,
      [
        title || currentTask.title,
        description !== undefined ? description : currentTask.description,
        listId || currentTask.list_id,
        assignedTo !== undefined ? assignedTo : currentTask.assigned_to,
        priority || currentTask.priority,
        status || currentTask.status,
        taskId
      ]
    );
    
    res.json({
      message: 'Task updated successfully',
      task: taskResult.rows[0]
    });
    
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;