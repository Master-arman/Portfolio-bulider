const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDetails() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log(`Checking tables in ${process.env.DB_NAME}...`);
    const [tables] = await connection.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n--- TABLE: ${tableName} ---`);
      const [desc] = await connection.query(`DESCRIBE ${tableName}`);
      console.table(desc);
      
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`Total rows: ${rows[0].count}`);
    }
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDetails();
