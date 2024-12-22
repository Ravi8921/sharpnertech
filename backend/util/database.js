// Example in a file like util/database.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('appointment', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});

module.exports = sequelize;


// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('appointment', 'root', '', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

module.exports = sequelize;
