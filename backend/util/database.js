// Example in a file like util/database.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});

module.exports = sequelize;

