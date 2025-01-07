const User = require('../models/registerModel'); // Import the User model

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure request body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // Create the user record
    const newUser = await User.create({ name, email, password });

    return res.status(201).json({
      message: 'User created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { createUser };
