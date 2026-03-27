const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  school: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  degree: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  field: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  startYear: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  endYear: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  // portfolioId is added via association in models/index.js
}, {
  tableName: 'education',
  timestamps: false,
});

module.exports = Education;
