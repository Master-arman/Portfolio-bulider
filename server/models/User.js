const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
}, {
  timestamps: true,
});

module.exports = User;
