const Expense = require('../models/expenseModel');  // Import the Expense model
const User = require('../models/registerModel');
const Sequelize = require('../util/database');
// Add a new expense
// const addExpense = async (req, res) => {
//     try {
//         const { amount, description, category } = req.body;

//         // Validate input fields
//         if (!amount || !description || !category) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Create a new expense
//         const newExpense = await Expense.create({
//             amount,
//             description,
//             category,
//             userId:req.user.id
//         });

//         // Respond with the newly created expense
//         return res.status(201).json({ message: 'Expense added successfully.', expense: newExpense });
//     } catch (error) {
//         console.error('Error adding expense:', error);
//         return res.status(500).json({ message: 'Error adding expense.' });
//     }
// };
 // Import User model

// const addExpense = async (req, res) => {
//     try {
//         const { amount, description, category } = req.body;

//         // Validate input fields
//         if (!amount || !description || !category) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Create a new expense
//         const newExpense = await Expense.create({
//             amount,
//             description,
//             category,
//             userId: req.user.id
//         });

//         // Calculate the total expense for the user
//         const totalExpense = await Expense.sum('amount', { where: { userId: req.user.id } });

//         // Update total_expense in the User table
//         await User.update(
//             { total_expense: totalExpense },
//             { where: { id: req.user.id } }
//         );

//         // Respond with success
//         return res.status(201).json({ message: 'Expense added successfully.', expense: newExpense, total_expense: totalExpense });

//     } catch (error) {
//         console.error('Error adding expense:', error);
//         return res.status(500).json({ message: 'Error adding expense.' });
//     }
// };

const addExpense = async (req, res) => {
  const t = await Sequelize.transaction(); // Start transaction

  try {
      const { amount, description, category } = req.body;

      if (!amount || !description || !category) {
          return res.status(400).json({ message: 'All fields are required.' });
      }

      // Create a new expense
      const newExpense = await Expense.create({
          amount,
          description,
          category,
          userId: req.user.id
      }, { transaction: t });

      // Calculate the total expense for the user
      const totalExpense = await Expense.sum('amount', { 
          where: { userId: req.user.id },
          transaction: t
      });

      // Update total_expense in the User table
      await User.update(
          { total_expense: totalExpense },
          { where: { id: req.user.id }, transaction: t }
      );

      // Commit transaction
      await t.commit();

      return res.status(201).json({ 
          message: 'Expense added successfully.', 
          expense: newExpense, 
          total_expense: totalExpense 
      });

  } catch (error) {
      await t.rollback(); // Rollback transaction on error
      console.error('Error adding expense:', error);
      return res.status(500).json({ message: 'Error adding expense.' });
  }
};




const deleteExpense = async (req, res) => {
    const t = await Sequelize.transaction();
    
    try {
        const { id } = req.params;

        const expense = await Expense.findOne({ 
            where: { id }, 
            transaction: t 
        });

        if (!expense) {
            await t.rollback(); // Rollback transaction if expense is not found
            return res.status(404).json({ message: 'Expense not found.' });
        }

        await expense.destroy({ transaction: t });

        await t.commit(); // Commit the transaction after successful deletion

        return res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        await t.rollback(); // Rollback transaction in case of an error
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Delete an expense
// const deleteExpense = async (req, res) => {
// const { expenseId, id } = req.params;

// // Ensure expenseId and userId are valid
// if (!expenseId || !id) {
//     return res.status(400).json({ error: "Expense ID and User ID are required" });
// }

// try {
//     const t = await Sequelize.transaction();
    
//     // Delete the expense
//     await Expense.destroy({ where: { id: expenseId }, transaction: t });

//     // Recalculate total expense
//     const totalExpense = await Expense.sum('amount', { where: { userId } }) || 0;

//     // Update total expense for the user
//     await User.update({ total_expense: totalExpense }, { where: { id: userId }, transaction: t });

//     // Commit the transaction
//     await t.commit();
//     res.status(200).json({ message: "Expense deleted successfully" });
// } catch (error) {
//     await t.rollback();
//     console.error("Error deleting expense:", error);
//     res.status(500).json({ error: error.message });
// }
// };
// const deleteExpense = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const expense = await Expense.findOne({ where: { id } });

//         if (!expense) {
//             return res.status(404).json({ message: 'Expense not found.' });
//         }

//         await expense.destroy();

//         return res.status(200).json({ message: 'Expense deleted successfully.' });
//     } catch (error) {
//         console.error('Error deleting expense:', error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// };
// const deleteExpense = async (req, res) => {
//   const expenseId = req.params.expenseid;

//   // Validate expenseId
//   if (!expenseId || expenseId.length === 0) {
//       return res.status(400).json({ success: false, message: "Expense ID is required" });
//   }

//   try {
//       // Start a transaction
//       const t = await Sequelize.transaction();

//       // Delete the expense
//       const noOfRows = await Expense.destroy({
//           where: { id: expenseId, userId: req.user.id },
//           transaction: t
//       });

//       if (noOfRows === 0) {
//           return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
//       }

//       // Recalculate total expense for the user
//       const totalExpense = await Expense.sum('amount', { where: { userId: req.user.id }, transaction: t }) || 0;

//       // Update the user's total expense
//       await User.update({ total_expense: totalExpense }, {
//           where: { id: req.user.id },
//           transaction: t
//       });

//       // Commit the transaction
//       await t.commit();

//       return res.status(200).json({ success: true, message: "Deleted Successfully" });
//   } catch (err) {
//       await t.rollback();
//       console.log(err);
//       return res.status(500).json({ success: false, message: "Failed to delete expense" });
//   }
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
