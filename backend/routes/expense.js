const express = require('express');
const expenseController = require('../controllers/expenseController');
const middleware = require('../middleware/auth'); // Import authentication middleware
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

// Routes for expense operations
router.post('/addexpense', middleware.authenticateToken, expenseController.addExpense);
router.post('/getExpense', middleware.authenticateToken, expenseController.getExpenses);
router.delete('/deleteExpense/:id', middleware.authenticateToken, expenseController.deleteExpense);



router.get ('/purchasepremium', middleware.authenticateToken,purchaseController.purchasePremium )
router.post ('/updateTransactionStatus', middleware.authenticateToken,purchaseController.updateTransactionStatus )

module.exports = router;
