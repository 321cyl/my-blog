const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { testConnection } = require('./models/db');
const Post = require('./models/Post');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret123';

// 测试接口
app.get('/', (req, res) => {
  res.send('后端服务已启动！');
});

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ msg: '用户名或密码错误' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: '用户名或密码错误' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: '登录失败', error: err.message });
  }
});

// 鉴权中间件
function auth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (!token) return res.status(401).json({ msg: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token 无效或已过期' });
  }
}

// 文章接口
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: '获取文章失败', error: err.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: '文章不存在' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: '获取文章失败', error: err.message });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: '创建文章失败', error: err.message });
  }
});

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    await Post.remove(req.params.id);
    res.json({ msg: '删除成功' });
  } catch (err) {
    res.status(500).json({ msg: '删除失败', error: err.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 后端跑在 http://localhost:${PORT}`);
  });
});