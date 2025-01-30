const Expense = require('../models/expenseModel');  // Import the Expense model

// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        // Validate input fields
        if (!amount || !description || !category) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new expense
        const newExpense = await Expense.create({
            amount,
            description,
            category,
            userId:req.user.id
        });

        // Respond with the newly created expense
        return res.status(201).json({ message: 'Expense added successfully.', expense: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        return res.status(500).json({ message: 'Error adding expense.' });
    }
};


// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findOne({ where: { id } });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        await expense.destroy();

        return res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
// const deleteExpense = (req, res) => {
//     const expenseid = req.params.expenseid;

//     if (!expenseid || expenseid.length === 0) {
//         return res.status(400).json({ success: false, message: "Invalid expense ID" });
//     }

//     Expense.destroy({ where: { id: expenseid, userId: req.user.id } })
//         .then((noofrows) => {
//             if (noofrows === 0) {
//                 return res.status(404).json({ success: false, message: "Expense doesn't belong to the user or not found" });
//             }

//             return res.status(200).json({ success: true, message: "Deleted Successfully" });
//         })
//         .catch((err) => {
//             console.error(err);
//             return res.status(500).json({ success: false, message: "Failed to delete expense" });
//         });
// };

// Get all expenses
const getExpenses = async (req, res) => {
    try {
      // Assuming the logged-in user's ID is available as req.user.id
      const userId = req.user.id;
  
      // Fetch expenses for the logged-in user
      const expenses = await Expense.findAll({
        where: { userId }, // Filter by userId
      });
  
      // Return an empty array if no expenses are found
      return res.status(200).json({
        message: 'Expenses fetched successfully.',
        expenses: expenses || [], // Default to an empty array if no expenses
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return res.status(500).json({ message: 'Error fetching expenses.' });
    }
  };
  


module.exports = { addExpense, deleteExpense, getExpenses };
