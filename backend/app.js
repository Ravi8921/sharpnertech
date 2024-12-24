const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS module
const path = require('path');

const sequelize = require('./util/database'); // Sequelize database connection

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Routes
const attendanceRoutes = require('./routes/attendance'); // Import routes for attendance API
app.use('/api', attendanceRoutes); // Use attendance routes with '/api' base path

// Start the server and sync the Sequelize models
sequelize
  .sync() // Sync models with the database
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log('Error syncing database:', err);
  });
