const express = require('express');
const expenseController = require('../controllers/expenseController');
const middleware = require('../middleware/auth'); // Import authentication middleware

const router = express.Router();

// Routes for expense operations
router.post('/addexpense', middleware.authenticateToken, expenseController.addExpense);
router.post('/getExpense', middleware.authenticateToken, expenseController.getExpenses);
router.delete('/deleteExpense/:id', middleware.authenticateToken, expenseController.deleteExpense);

module.exports = router;
