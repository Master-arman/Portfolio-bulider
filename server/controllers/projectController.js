const db = require('../config/db');

exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching projects' });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, image_url, github_link, live_link } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO projects (title, description, image_url, github_link, live_link) VALUES (?, ?, ?, ?, ?)',
      [title, description, image_url, github_link, live_link]
    );
    res.status(201).json({ id: result.insertId, title, description, image_url, github_link, live_link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating project' });
  }
};
