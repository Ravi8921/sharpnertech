const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') 
                  ? req.headers['authorization'].split(' ')[1] 
                  : null; 

    if (!token) {
        console.log('Token missing');
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    const secretKey = process.env.JWT_SECRET || 'secret_key'; 

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user; 
        next();
    });
};

module.exports = { authenticateToken };
