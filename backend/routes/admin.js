const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// GET all expenses
router.get('/expenses', adminController.getExpenses);

// POST a new expense
router.post('/expenses', adminController.createExpense);

// PUT/update an expense by ID
router.put('/expenses/:id', adminController.updateExpenseById);

// DELETE an expense by ID
router.delete('/expenses/:id', adminController.deleteExpenseById);

module.exports = router;
