-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    github_link VARCHAR(500),
    live_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table (for Contact Form)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Projects (Optional)
INSERT INTO projects (title, description, image_url, github_link) VALUES 
('Portfolio Builder', 'A web app to build and host portfolios.', 'https://via.placeholder.com/300', 'https://github.com/user/portfolio'),
('E-commerce Platform', 'A full-stack e-commerce solution.', 'https://via.placeholder.com/300', 'https://github.com/user/ecommerce');
