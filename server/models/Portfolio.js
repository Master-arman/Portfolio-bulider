const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  fullName: {
    type: DataTypes.STRING,
  },
  professionalTitle: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  profilePicUrl: {
    type: DataTypes.TEXT,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  github: {
    type: DataTypes.STRING(500),
  },
  linkedin: {
    type: DataTypes.STRING(500),
  },
  twitter: {
    type: DataTypes.STRING(500),
  },
  website: {
    type: DataTypes.STRING(500),
  },
  skills: {
    type: DataTypes.JSON,
  },
  projects: {
    type: DataTypes.JSON,
  },
  education: {
    type: DataTypes.JSON,
  },
  experience: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  template: {
    type: DataTypes.STRING,
    defaultValue: 'minimal',
  },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

// Relationships
User.hasOne(Portfolio, { foreignKey: 'userId', onDelete: 'CASCADE' });
Portfolio.belongsTo(User, { foreignKey: 'userId' });

module.exports = Portfolio;
