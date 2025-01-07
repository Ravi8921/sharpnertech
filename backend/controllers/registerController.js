const User = require('../models/registerModel'); // Import the User model

// Sign up a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Create a new user
        const newUser = await User.create({ name, email, password });

        return res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
 

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Get email and password from request body

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // If user doesn't exist
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the password matches
        if (user.password !== password) {
            // If password is incorrect
            return res.status(401).json({ message: 'User not authorized. Incorrect password.' });
        }

        // If login is successful
        return res.status(200).json({
            message: 'User login successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { createUser,loginUser };
