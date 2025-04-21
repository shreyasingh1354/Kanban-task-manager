const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Dashboard route: fetch all user tasks (across teams) categorized by list title
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch tasks assigned to the user along with their list title and board title
    const result = await pool.query(
      `SELECT T.id, T.title, T.description, B.title AS board_title, L.title AS list_title
       FROM TASK T
       JOIN LIST L ON T.list_id = L.id
       JOIN BOARD B ON L.board_id = B.id
       WHERE T.assigned_to = $1
       ORDER BY T.id ASC`,
      [userId]
    );

    // Categorize based on list_title (NOT task.status)
    const categorized = {
      todo: [],
      inProgress: [],
      completed: []
    };

    result.rows.forEach(task => {
      const listTitle = task.list_title?.toLowerCase().trim();

      if (listTitle === 'to do') categorized.todo.push(task);
      else if (listTitle === 'in progress' || listTitle === 'review') categorized.inProgress.push(task);
      else if (listTitle === 'done') categorized.completed.push(task);
    });

    res.json({
      success: true,
      data: categorized
    });

  } catch (err) {
    console.error("Dashboard tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
