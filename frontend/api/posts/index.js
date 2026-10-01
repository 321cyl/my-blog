const jwt = require('jsonwebtoken');
const Post = require('../../models/Post');

function auth(req) {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (!token) throw new Error('未登录');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mysecret123');
  } catch {
    throw new Error('token 无效');
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const posts = await Post.findAll();
      return res.json(posts);
    }

    if (req.method === 'POST') {
      auth(req);
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        tags: req.body.tags
      });
      return res.json(post);
    }

    return res.status(405).json({ msg: '不支持的方法' });
  } catch (err) {
    console.error('========== /api/posts 错误 ==========');
    console.error('err:', err);
    console.error('err.message:', err.message);
    console.error('err.stack:', err.stack);
    console.error('====================================');
    const msg = err?.message || String(err) || '未知错误';
    const code = (msg.includes('登录') || msg.includes('token')) ? 401 : 500;
    res.status(code).json({ msg, debug: String(err) });
  }
};