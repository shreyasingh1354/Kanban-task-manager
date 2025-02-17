const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser } = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await createUser(username, email, hashedPassword);
  res.json({ message: 'User registered successfully', user: result.rows[0] });
});

module.exports = router;