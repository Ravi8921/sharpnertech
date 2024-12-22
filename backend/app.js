const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS module
const path = require('path');

const sequelize = require('./util/database');

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json()); // Parse JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Your existing routes
const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });
