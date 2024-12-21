// Import the Sequelize instance from your database configuration file
const Sequelize = require('sequelize');
const sequelize = require('../util/database');  // Make sure this is the correct path to your sequelize instance

// Define the Appointment model
const Appointment = sequelize.define('appointment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  appointmentDate: {
    type: Sequelize.DATE,
    allowNull: true,
  }
}, {
  tableName: 'appointments'  // Make sure you're using the correct table name
});

// Export the Appointment model to be used elsewhere
module.exports = Appointment;
