const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') 
        ? req.headers['authorization'].split(' ')[1] 
        : null;

    // Check if token is missing
    if (!token) {
        console.log('Token missing');
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    const secretKey = process.env.JWT_SECRET || 'secret_key'; // Use a fallback secret for development/testing

    // Verify token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Attach the user ID to the request object
        req.user = { id: user.id }; // `user` contains the decoded payload
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { authenticateToken };
