const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

async function createAdmin() {
  try {
    const existing = await User.findByUsername(ADMIN_USERNAME);
    if (existing) {
      console.log('⚠️ 该用户已存在:', ADMIN_USERNAME);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      username: ADMIN_USERNAME,
      passwordHash: passwordHash,
      role: 'admin'
    });

    console.log('🎉 管理员创建成功！');
    console.log('用户名:', ADMIN_USERNAME);
    console.log('密码:', ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('❌ 创建失败:', err.message);
    process.exit(1);
  }
}

createAdmin();