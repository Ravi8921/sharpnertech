const Expense = require("../models/product");

const createExpense = async (req, res) => {
  try {
    const { name, amount, category } = req.body;
    const newExpense = await Expense.create({ name, amount, category });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, category } = req.body;
    const expense = await Expense.findByPk(id);
    if (expense) {
      await expense.update({ name, amount, category });
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (expense) {
      await expense.destroy();
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createExpense, getExpenses, updateExpenseById, deleteExpenseById };
