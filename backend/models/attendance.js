// models/attendance.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Assuming your database connection is here

class Attendance extends Model {}

Attendance.init(
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,  // Only store the date (no time)
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Attendance',
  }
);

module.exports = Attendance;
