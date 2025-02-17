const pool = require('./config/db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL at:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection error:', error);
  }
})();