const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
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

// Middleware to add user to request object
app.use((req, res, next) => {
  User.findByPk(1) // Correct method to find a user by primary key
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Use routes for admin and shop
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handle 404 errors
app.use(errorController.get404);

// Define associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Start the server after syncing with the database

sequelize.sync({ force: true })

  // .sync({ force: true }) // Uncomment for a fresh database
  // .sync()
  .then(result => {
    return User.findByPk(1); // Correct method to find a user by primary key
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'ravi', email: 'ravi@admin.com' });
    }
    return user;
  })
  .then(user => {
    console.log('Database synced successfully');
    app.listen(3002, () => {
      console.log('Server is running on http://localhost:3002');
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });
