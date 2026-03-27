const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Untitled',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  github_link: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  live_link: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // portfolioId is added via association in models/index.js
}, {
  tableName: 'projects',
  timestamps: false,
});

module.exports = Project;
