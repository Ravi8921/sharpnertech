const express = require('express');

const expenseController = require('../controllers/expenseController');
const router = express.Router();


// Route to create attendance record
router.post('/addexpense', expenseController.addExpense);
router.post('/getExpense', expenseController.getExpenses);
// router.delete('/deleteExpense', expenseController.deleteExpense);
router.delete('/deleteExpense/:id',expenseController. deleteExpense);

module.exports = router;
