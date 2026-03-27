-- ============================================================
-- Portfolio Builder - Normalized Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ============================================================
-- 1. Users Table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255)        DEFAULT '',
    email        VARCHAR(255) UNIQUE NOT NULL,
    password     VARCHAR(255)        NOT NULL,
    avatar       TEXT,
    bio          TEXT,
    phone        VARCHAR(50),
    location     VARCHAR(255),
    createdAt    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updatedAt    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Portfolios Table
-- ============================================================
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
    template            VARCHAR(100)  DEFAULT 'minimal',
    createdAt           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. Skills Table
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    portfolioId INT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. Projects Table
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    portfolioId INT NOT NULL,
    title       VARCHAR(255)  DEFAULT 'Untitled',
    description TEXT,
    image_url   TEXT,
    github_link VARCHAR(500),
    live_link   VARCHAR(500),
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. Education Table
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    portfolioId INT NOT NULL,
    school      VARCHAR(255),
    degree      VARCHAR(255),
    field       VARCHAR(255),
    startYear   VARCHAR(10),
    endYear     VARCHAR(10),
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. Experiences Table
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    portfolioId INT NOT NULL,
    role        VARCHAR(255),
    company     VARCHAR(255),
    duration    VARCHAR(100),
    description TEXT,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. Certifications Table
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    portfolioId INT NOT NULL,
    name        VARCHAR(255),
    issuer      VARCHAR(255),
    year        VARCHAR(10),
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. Messages Table (Contact Form)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(255),
    message    TEXT         NOT NULL,
    createdAt  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BACKUP TABLES
-- These mirror each main table and store rows before deletion.
-- A deleted_at column records when the row was removed.
-- ============================================================

CREATE TABLE IF NOT EXISTS users_backup (
    id           INT,
    name         VARCHAR(255),
    email        VARCHAR(255),
    password     VARCHAR(255),
    avatar       TEXT,
    bio          TEXT,
    phone        VARCHAR(50),
    location     VARCHAR(255),
    createdAt    TIMESTAMP,
    updatedAt    TIMESTAMP,
    deleted_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios_backup (
    id                  INT,
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
    template            VARCHAR(100),
    createdAt           TIMESTAMP,
    updatedAt           TIMESTAMP,
    deleted_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills_backup (
    id          INT,
    portfolioId INT,
    name        VARCHAR(255),
    deleted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_backup (
    id          INT,
    portfolioId INT,
    title       VARCHAR(255),
    description TEXT,
    image_url   TEXT,
    github_link VARCHAR(500),
    live_link   VARCHAR(500),
    deleted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education_backup (
    id          INT,
    portfolioId INT,
    school      VARCHAR(255),
    degree      VARCHAR(255),
    field       VARCHAR(255),
    startYear   VARCHAR(10),
    endYear     VARCHAR(10),
    deleted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences_backup (
    id          INT,
    portfolioId INT,
    role        VARCHAR(255),
    company     VARCHAR(255),
    duration    VARCHAR(100),
    description TEXT,
    deleted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications_backup (
    id          INT,
    portfolioId INT,
    name        VARCHAR(255),
    issuer      VARCHAR(255),
    year        VARCHAR(10),
    deleted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BEFORE DELETE TRIGGERS
-- Auto-copy a row into its backup table before it is deleted.
-- ============================================================

DROP TRIGGER IF EXISTS trg_users_backup;
DELIMITER $$
CREATE TRIGGER trg_users_backup
BEFORE DELETE ON users FOR EACH ROW
BEGIN
    INSERT INTO users_backup (id, name, email, password, avatar, bio, phone, location, createdAt, updatedAt)
    VALUES (OLD.id, OLD.name, OLD.email, OLD.password, OLD.avatar, OLD.bio, OLD.phone, OLD.location, OLD.createdAt, OLD.updatedAt);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_portfolios_backup;
DELIMITER $$
CREATE TRIGGER trg_portfolios_backup
BEFORE DELETE ON portfolios FOR EACH ROW
BEGIN
    INSERT INTO portfolios_backup (id, userId, fullName, professionalTitle, location, email, phone, bio, profilePicUrl, github, linkedin, twitter, website, template, createdAt, updatedAt)
    VALUES (OLD.id, OLD.userId, OLD.fullName, OLD.professionalTitle, OLD.location, OLD.email, OLD.phone, OLD.bio, OLD.profilePicUrl, OLD.github, OLD.linkedin, OLD.twitter, OLD.website, OLD.template, OLD.createdAt, OLD.updatedAt);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_skills_backup;
DELIMITER $$
CREATE TRIGGER trg_skills_backup
BEFORE DELETE ON skills FOR EACH ROW
BEGIN
    INSERT INTO skills_backup (id, portfolioId, name)
    VALUES (OLD.id, OLD.portfolioId, OLD.name);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_projects_backup;
DELIMITER $$
CREATE TRIGGER trg_projects_backup
BEFORE DELETE ON projects FOR EACH ROW
BEGIN
    INSERT INTO projects_backup (id, portfolioId, title, description, image_url, github_link, live_link)
    VALUES (OLD.id, OLD.portfolioId, OLD.title, OLD.description, OLD.image_url, OLD.github_link, OLD.live_link);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_education_backup;
DELIMITER $$
CREATE TRIGGER trg_education_backup
BEFORE DELETE ON education FOR EACH ROW
BEGIN
    INSERT INTO education_backup (id, portfolioId, school, degree, field, startYear, endYear)
    VALUES (OLD.id, OLD.portfolioId, OLD.school, OLD.degree, OLD.field, OLD.startYear, OLD.endYear);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_experiences_backup;
DELIMITER $$
CREATE TRIGGER trg_experiences_backup
BEFORE DELETE ON experiences FOR EACH ROW
BEGIN
    INSERT INTO experiences_backup (id, portfolioId, role, company, duration, description)
    VALUES (OLD.id, OLD.portfolioId, OLD.role, OLD.company, OLD.duration, OLD.description);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_certifications_backup;
DELIMITER $$
CREATE TRIGGER trg_certifications_backup
BEFORE DELETE ON certifications FOR EACH ROW
BEGIN
    INSERT INTO certifications_backup (id, portfolioId, name, issuer, year)
    VALUES (OLD.id, OLD.portfolioId, OLD.name, OLD.issuer, OLD.year);
END$$
DELIMITER ;

