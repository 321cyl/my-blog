const { pool } = require('./db.cjs');

async function findByUsername(username) {
  const [rows] = await pool.query(
    'SELECT id, username, passwordHash, role FROM users WHERE username = ?',
    [username]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return { ...row, _id: row.id };
}

async function create({ username, passwordHash, role }) {
  const [result] = await pool.query(
    'INSERT INTO users (username, passwordHash, role) VALUES (?, ?, ?)',
    [username, passwordHash, role || 'admin']
  );
  return { id: result.insertId, username, role };
}

module.exports = { findByUsername, create };