const express = require('express');

const registerController = require('../controllers/registerController');
const router = express.Router();


// Route to create attendance record
router.post('/signup', registerController.createUser);
router.post('/login', registerController.loginUser);

module.exports = router;
