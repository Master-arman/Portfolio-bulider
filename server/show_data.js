const mysql = require('mysql2/promise');
require('dotenv').config();

async function showData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log('--- USERS ---');
    const [users] = await connection.query('SELECT id, email FROM users');
    console.table(users);
    
    console.log('\n--- PORTFOLIOS ---');
    const [portfolios] = await connection.query('SELECT id, userId, fullName FROM portfolios');
    console.table(portfolios);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

showData();
