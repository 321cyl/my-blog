const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'rju3ru8XiffV9RN.root',
  password: 'kN4yDpm41g13A5Pw',
  database: 'blog',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 20000,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = { pool };