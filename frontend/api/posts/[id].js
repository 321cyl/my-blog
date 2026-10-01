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
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ msg: '文章不存在' });
      return res.json(post);
    }

    if (req.method === 'DELETE') {
      auth(req);
      await Post.remove(id);
      return res.json({ msg: '删除成功' });
    }

    return res.status(405).json({ msg: '不支持的方法' });
  } catch (err) {
    const code = err.message.includes('登录') || err.message.includes('token') ? 401 : 500;
    res.status(code).json({ msg: err.message });
  }
};