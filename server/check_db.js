const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabases() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Available Databases:');
    rows.forEach(row => console.log(' - ' + row.Database));
    await connection.end();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
  }
}

checkDatabases();
