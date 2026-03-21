const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        console.log("Connecting to MySQL server...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER || process.env.USER,
            password: process.env.DB_PASSWORD || process.env.PASSWORD,
        });

        // 1. Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'portfolio_db'}\``);
        console.log("Checked database exists.");

        // 2. Use it
        await connection.query(`USE \`${process.env.DB_NAME || 'portfolio_db'}\``);
        
        // 3. Create Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table ready.");

        // 4. Create Portfolios table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS portfolios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                fullName VARCHAR(255),
                professionalTitle VARCHAR(255),
                location VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(255),
                bio TEXT,
                profilePicUrl TEXT,
                github VARCHAR(500),
                linkedin VARCHAR(500),
                twitter VARCHAR(500),
                website VARCHAR(500),
                skills JSON,
                projects JSON,
                education JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Portfolios table ready.");
        
        // 5. Insert dummy user for testing if no users exist
        const [rows] = await connection.query(`SELECT * FROM users WHERE id = 1`);
        if (rows.length === 0) {
             await connection.query(`INSERT INTO users (id, email, password) VALUES (1, 'test@example.com', 'password123')`);
             console.log("Inserted test user with ID 1.");
        }

        console.log("Database initialized successfully!");
        process.exit(0);

    } catch (err) {
        console.error("Failed to initialize database", err);
        process.exit(1);
    }
}

initDB();
