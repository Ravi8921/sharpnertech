const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Ensure cors is imported
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();

// Set view engine to EJS and configure views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enable CORS for all origins (you can replace '*' with a specific domain for more security)
app.use(cors({
  origin: '*' // Replace with your domain if you want to restrict
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes for admin and shop
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handle 404 errors
app.use(errorController.get404);

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
