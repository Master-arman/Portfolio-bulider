const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        console.log('Connecting to MySQL server...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER || process.env.USER,
            password: process.env.DB_PASSWORD || process.env.PASSWORD,
        });

        const DB = process.env.DB_NAME || 'portfolio_db';

        // 1. Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\``);
        await connection.query(`USE \`${DB}\``);
        console.log(`Database "${DB}" ready.`);

        // 2. Users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id           INT AUTO_INCREMENT PRIMARY KEY,
                name         VARCHAR(255)        DEFAULT '',
                email        VARCHAR(255) UNIQUE NOT NULL,
                password     VARCHAR(255)        NOT NULL,
                avatar       TEXT,
                bio          TEXT,
                phone        VARCHAR(50),
                location     VARCHAR(255),
                createdAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('users table ready.');

        // 3. Portfolios
        await connection.query(`
            CREATE TABLE IF NOT EXISTS portfolios (
                id                  INT AUTO_INCREMENT PRIMARY KEY,
                userId              INT,
                fullName            VARCHAR(255),
                professionalTitle   VARCHAR(255),
                location            VARCHAR(255),
                email               VARCHAR(255),
                phone               VARCHAR(50),
                bio                 TEXT,
                profilePicUrl       TEXT,
                github              VARCHAR(500),
                linkedin            VARCHAR(500),
                twitter             VARCHAR(500),
                website             VARCHAR(500),
                template            VARCHAR(100) DEFAULT 'minimal',
                createdAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('portfolios table ready.');

        // 4. Skills
        await connection.query(`
            CREATE TABLE IF NOT EXISTS skills (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                portfolioId INT NOT NULL,
                name        VARCHAR(255) NOT NULL,
                FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
            )
        `);
        console.log('skills table ready.');

        // 5. Projects
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                portfolioId INT NOT NULL,
                title       VARCHAR(255) DEFAULT 'Untitled',
                description TEXT,
                image_url   TEXT,
                github_link VARCHAR(500),
                live_link   VARCHAR(500),
                FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
            )
        `);
        console.log('projects table ready.');

        // 6. Education
        await connection.query(`
            CREATE TABLE IF NOT EXISTS education (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                portfolioId INT NOT NULL,
                school      VARCHAR(255),
                degree      VARCHAR(255),
                field       VARCHAR(255),
                startYear   VARCHAR(10),
                endYear     VARCHAR(10),
                FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
            )
        `);
        console.log('education table ready.');

        // 7. Experiences
        await connection.query(`
            CREATE TABLE IF NOT EXISTS experiences (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                portfolioId INT NOT NULL,
                role        VARCHAR(255),
                company     VARCHAR(255),
                duration    VARCHAR(100),
                description TEXT,
                FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
            )
        `);
        console.log('experiences table ready.');

        // 8. Certifications
        await connection.query(`
            CREATE TABLE IF NOT EXISTS certifications (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                portfolioId INT NOT NULL,
                name        VARCHAR(255),
                issuer      VARCHAR(255),
                year        VARCHAR(10),
                FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
            )
        `);
        console.log('certifications table ready.');

        // 9. Messages
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id        INT AUTO_INCREMENT PRIMARY KEY,
                name      VARCHAR(255) NOT NULL,
                email     VARCHAR(255) NOT NULL,
                subject   VARCHAR(255),
                message   TEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('messages table ready.');

        // ── BACKUP TABLES ────────────────────────────────────────────
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users_backup (
                id         INT, name VARCHAR(255), email VARCHAR(255),
                password   VARCHAR(255), avatar TEXT, bio TEXT,
                phone      VARCHAR(50), location VARCHAR(255),
                createdAt  TIMESTAMP, updatedAt TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS portfolios_backup (
                id INT, userId INT, fullName VARCHAR(255),
                professionalTitle VARCHAR(255), location VARCHAR(255),
                email VARCHAR(255), phone VARCHAR(50), bio TEXT,
                profilePicUrl TEXT, github VARCHAR(500),
                linkedin VARCHAR(500), twitter VARCHAR(500),
                website VARCHAR(500), template VARCHAR(100),
                createdAt TIMESTAMP, updatedAt TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS skills_backup (
                id INT, portfolioId INT, name VARCHAR(255),
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects_backup (
                id INT, portfolioId INT, title VARCHAR(255),
                description TEXT, image_url TEXT,
                github_link VARCHAR(500), live_link VARCHAR(500),
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS education_backup (
                id INT, portfolioId INT, school VARCHAR(255),
                degree VARCHAR(255), field VARCHAR(255),
                startYear VARCHAR(10), endYear VARCHAR(10),
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS experiences_backup (
                id INT, portfolioId INT, role VARCHAR(255),
                company VARCHAR(255), duration VARCHAR(100),
                description TEXT,
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS certifications_backup (
                id INT, portfolioId INT, name VARCHAR(255),
                issuer VARCHAR(255), year VARCHAR(10),
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('All backup tables ready.');

        // ── BEFORE DELETE TRIGGERS ───────────────────────────────────
        // mysql2 does NOT support DELIMITER, so we set multipleStatements
        // and create/drop triggers directly.
        const triggers = [
            {
                name: 'trg_users_backup',
                table: 'users',
                body: `INSERT INTO users_backup (id,name,email,password,avatar,bio,phone,location,createdAt,updatedAt)
                       VALUES (OLD.id,OLD.name,OLD.email,OLD.password,OLD.avatar,OLD.bio,OLD.phone,OLD.location,OLD.createdAt,OLD.updatedAt);`
            },
            {
                name: 'trg_portfolios_backup',
                table: 'portfolios',
                body: `INSERT INTO portfolios_backup (id,userId,fullName,professionalTitle,location,email,phone,bio,profilePicUrl,github,linkedin,twitter,website,template,createdAt,updatedAt)
                       VALUES (OLD.id,OLD.userId,OLD.fullName,OLD.professionalTitle,OLD.location,OLD.email,OLD.phone,OLD.bio,OLD.profilePicUrl,OLD.github,OLD.linkedin,OLD.twitter,OLD.website,OLD.template,OLD.createdAt,OLD.updatedAt);`
            },
            {
                name: 'trg_skills_backup',
                table: 'skills',
                body: `INSERT INTO skills_backup (id,portfolioId,name) VALUES (OLD.id,OLD.portfolioId,OLD.name);`
            },
            {
                name: 'trg_projects_backup',
                table: 'projects',
                body: `INSERT INTO projects_backup (id,portfolioId,title,description,image_url,github_link,live_link)
                       VALUES (OLD.id,OLD.portfolioId,OLD.title,OLD.description,OLD.image_url,OLD.github_link,OLD.live_link);`
            },
            {
                name: 'trg_education_backup',
                table: 'education',
                body: `INSERT INTO education_backup (id,portfolioId,school,degree,field,startYear,endYear)
                       VALUES (OLD.id,OLD.portfolioId,OLD.school,OLD.degree,OLD.field,OLD.startYear,OLD.endYear);`
            },
            {
                name: 'trg_experiences_backup',
                table: 'experiences',
                body: `INSERT INTO experiences_backup (id,portfolioId,role,company,duration,description)
                       VALUES (OLD.id,OLD.portfolioId,OLD.role,OLD.company,OLD.duration,OLD.description);`
            },
            {
                name: 'trg_certifications_backup',
                table: 'certifications',
                body: `INSERT INTO certifications_backup (id,portfolioId,name,issuer,year)
                       VALUES (OLD.id,OLD.portfolioId,OLD.name,OLD.issuer,OLD.year);`
            },
        ];

        for (const t of triggers) {
            await connection.query(`DROP TRIGGER IF EXISTS \`${t.name}\``);
            await connection.query(
                `CREATE TRIGGER \`${t.name}\` BEFORE DELETE ON \`${t.table}\` FOR EACH ROW BEGIN ${t.body} END`
            );
            console.log(`Trigger ${t.name} created.`);
        }

        console.log('✅ Database initialized successfully (normalized + backups + triggers)!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    }
}

initDB();
