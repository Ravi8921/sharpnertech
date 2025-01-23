const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS module
const path = require('path');

const sequelize = require('./util/database'); // Sequelize database connection
const registerRoutes = require('./routes/register'); // Import blog routes
const expenseRoutes = require('./routes/expense'); // Import blog routes
const Expense = require('./models/expenseModel');
const User = require('./models/registerModel');
const Order = require('./models/orderModel');

const app = express();

// User.hasMany(Order);
// Order.belongsTo(User);
// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Routes
app.use('/user',registerRoutes); // Use blog routes with '/api' base path
app.use('/expense',expenseRoutes); 
// Start the server and sync the Sequelize models
sequelize
  .sync({ force: false }) // Use `force: true` with caution in development only
  .then(() => {
    console.log('Database synced successfully!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });


  