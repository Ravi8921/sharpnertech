
const User = require('../models/registerModel'); // Import the User model

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { isEmail } = require('validator');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// Sign up a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Login user
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: 'Email and password are required.' });
//         }

//         const user = await User.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const isPasswordMatch = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatch) {
//             return res.status(401).json({ message: 'User not authorized. Incorrect password.' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user.id, email: user.email }, // Payload
//             JWT_SECRET, // Secret key
//             { expiresIn: '1h' } // Token expiration
//         );

//         return res.status(200).json({
//             message: 'User login successful.',
//             token, // Return the token
//             user: { id: user.id, name: user.name, email: user.email },
//         });
//     } catch (error) {
//         console.error('Error logging in user:', error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// };
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // if (!isEmail(email)) {
        //     return res.status(400).json({ message: 'Invalid email format.' });
        // }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials.' });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token expiration
        );

        // Return success response
        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
module.exports = { createUser, loginUser };
