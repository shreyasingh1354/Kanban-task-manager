const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// ✅ Register User (Prevents duplicate emails/phones)
router.post('/register', async (req, res) => {
  const { username, email, phone_no, password } = req.body;

  // Validate input
  if (!username || !email || !phone_no || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR phone_no = $2', [email, phone_no]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email or phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, phone_no, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone_no',
      [username, email, phone_no, hashedPassword]
    );

    // Create token for immediate login
    const token = jwt.sign(
      { id: result.rows[0].id, email, phone_no }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: result.rows[0],
      token
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login User (Supports Email or Phone)
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const field = isEmail ? 'email' : 'phone_no';

    const userQuery = await pool.query(`SELECT * FROM users WHERE ${field} = $1`, [identifier]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone_no: user.phone_no }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        phone_no: user.phone_no 
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👤 Get Current User
router.get('/me', authenticate, async (req, res) => {
  try {
    const userQuery = await pool.query('SELECT id, username, email, phone_no FROM users WHERE id = $1', [req.user.id]);
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: userQuery.rows[0] });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;