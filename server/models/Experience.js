const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // portfolioId is added via association in models/index.js
}, {
  tableName: 'experiences',
  timestamps: false,
});

module.exports = Experience;
