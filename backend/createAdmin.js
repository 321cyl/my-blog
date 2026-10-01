const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const DB_URL = 'mongodb://127.0.0.1:27017/blog';

// 你想创建的管理员账号信息
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

async function createAdmin() {
  await mongoose.connect(DB_URL);
  console.log('✅ 数据库已连接');

  // 检查是否已存在同名用户
  const existing = await User.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log('⚠️ 该用户已存在:', ADMIN_USERNAME);
    await mongoose.disconnect();
    return;
  }

  // 密码加密
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // 创建用户
  await User.create({
    username: ADMIN_USERNAME,
    passwordHash: passwordHash,
    role: 'admin'
  });

  console.log('🎉 管理员创建成功！');
  console.log('用户名:', ADMIN_USERNAME);
  console.log('密码:', ADMIN_PASSWORD);

  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('❌ 创建失败:', err.message);
  process.exit(1);
});