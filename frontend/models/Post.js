const { pool } = require('./db');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, title, content, category, tags, createdAt FROM posts ORDER BY createdAt DESC'
  );
  return rows.map(row => ({
    ...row,
    _id: row.id,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
  }));
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, title, content, category, tags, createdAt FROM posts WHERE id = ?',
    [id]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    _id: row.id,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
  };
}

async function create({ title, content, category, tags }) {
  const tagsJson = JSON.stringify(tags || []);
  const [result] = await pool.query(
    'INSERT INTO posts (title, content, category, tags) VALUES (?, ?, ?, ?)',
    [title, content, category || '未分类', tagsJson]
  );
  return findById(result.insertId);
}

async function remove(id) {
  await pool.query('DELETE FROM posts WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, remove };