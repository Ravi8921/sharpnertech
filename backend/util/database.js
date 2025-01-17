// Example in a file like util/database.js
const Sequelize = require('sequelize');

<<<<<<< HEAD
const sequelize = new Sequelize('blog_test', 'root', '', {
=======
const sequelize = new Sequelize('bloging_system', 'root', '', {
>>>>>>> 43b1e31eaeb0799e6772b3d76aae8259f5ffdb11
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
