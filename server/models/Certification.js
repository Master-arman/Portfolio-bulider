const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certification = sequelize.define('Certification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  issuer: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  year: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  // portfolioId is added via association in models/index.js
}, {
  tableName: 'certifications',
  timestamps: false,
});

module.exports = Certification;
