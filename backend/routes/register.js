const express = require('express');
const middleware = require('../middleware/auth');
const registerController = require('../controllers/registerController');
const router = express.Router();


// Route to create attendance record
router.post('/signup', registerController.createUser);
router.post('/login', registerController.loginUser);
router.post('/generateAccessToken', registerController.generateAccessToken);
router.get('/getUserStatus',middleware.authenticateToken, registerController.getUserStatus);

module.exports = router;
