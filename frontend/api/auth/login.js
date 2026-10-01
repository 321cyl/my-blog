const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ msg: '只支持 POST' });
  }

  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ msg: '用户名或密码错误' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: '用户名或密码错误' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'mysecret123',
      { expiresIn: '7d' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: '登录失败', error: err.message });
  }
};