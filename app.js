const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointment');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');

const app = express();

// Set view engine to EJS and configure views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enable CORS for all origins (customize as needed for security)
app.use(cors({
  origin: '*' // Replace '*' with your domain if needed
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes for admin and shop
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(appointmentRoutes);
// Handle 404 errors
app.use(errorController.get404);

// Start the server after syncing with the database
sequelize
  .sync()
  .then(result => {
    console.log('Database synced successfully');
    app.listen(3002, () => {
      console.log('Server is running on http://localhost:3002');
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });
