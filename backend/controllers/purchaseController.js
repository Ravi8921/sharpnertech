const Razorpay = require('razorpay');
const Order = require('../models/orderModel'); // Assuming you have the Order model set up
require('dotenv').config(); // To use environment variables
const registerController = require('../controllers/registerController'); 
const User = require('../models/registerModel'); // Adjust the path as per your project structure
const Expense = require('../models/expenseModel');
const { Sequelize, Op } = require('sequelize');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Purchase premium function
const purchasePremium = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Create Razorpay order
        const amount = 49900; // Example amount in paise (₹499)
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
        });

        // Save the order in the database
        const newOrder = await Order.create({
            user_id: userId,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            payment_status: "pending", // Default status
        });

        res.status(200).json({
            key_id: process.env.RAZORPAY_KEY_ID,
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Failed to initiate the payment. Please try again." });
    }
};

// Update transaction status after successful payment
// const updateTransactionStatus = async (req, res) => {
//     try {
//         const { order_id, payment_id } = req.body;
//         const userId = req.user.id;

//         if (!order_id || !payment_id) {
//             return res.status(400).json({ message: "Order ID and Payment ID are required." });
//         }

//         // Find the order in the database
//         const order = await Order.findOne({ where: { order_id, user_id: userId } });
//         if (!order) {
//             return res.status(404).json({ message: "Order not found." });
//         }

//         // Update the order and user's premium status
//         const updateOrderPromise = order.update({ payment_id, payment_status: "Successful" });
//         const updateUserPromise = User.findByPk(userId).then((user) => {
//             if (!user) {
//                 throw new Error("User not found.");
//             }
//             return user.update({ isPremium: true });
//         });

//         await Promise.all([updateOrderPromise, updateUserPromise]);

//         // Generate access token and respond
//         const token = registerController.generateAccessToken(userId, undefined, true);
//         res.status(202).json({
//             success: true,
//             message: "Transaction successful",
//             token,
//         });
//     } catch (error) {
//         console.error("Error updating transaction status:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Failed to update transaction status. Please try again.",
//         });
//     }
// };
// const updateTransactionStatus = async (req, res) => {
//     try {
//         const { order_id, payment_id } = req.body;
//         const userId = req.user.id;

//         if (!order_id || !payment_id) {
//             return res.status(400).json({ message: "Order ID and Payment ID are required." });
//         }

//         // Find the order in the database
//         const order = await Order.findOne({ where: { order_id, user_id: userId } });
//         if (!order) {
//             return res.status(404).json({ message: "Order not found." });
//         }

//         // Update the order and user's premium status
//         const updateOrderPromise = order.update({ payment_id, payment_status: "Successful" });
//         const updateUserPromise = User.findByPk(userId).then((user) => {
//             if (!user) {
//                 throw new Error("User not found.");
//             }
            
//             return user.update({ isPremium: true });
//         });

//         await Promise.all([updateOrderPromise, updateUserPromise]);

//         // Generate access token and respond
//         const token = registerController.generateAccessToken(userId, undefined, true);
//         res.status(202).json({
//             success: true,
//             message: "Transaction successful",
//             token,
//         });
//     } catch (error) {
//         console.error("Error updating transaction status:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Failed to update transaction status. Please try again.",
//         });
//     }
// };
const verifyPayment = async (order_id, payment_id) => {
    try {
        const payment = await razorpay.payments.fetch(payment_id);
        console.log("Fetched Payment from Razorpay:", payment);
        return payment.status === "captured"; // Only "captured" means successful
    } catch (error) {
        console.error("Error verifying payment:", error.message);
        return false;
    }
};
const updateTransactionStatus = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { order_id, payment_id } = req.body;
        const userId = req.user.id;

        if (!order_id || !payment_id) {
            return res.status(400).json({ message: "Order ID and Payment ID are required." });
        }

        // Verify Payment from Razorpay
        const isPaymentSuccessful = await verifyPayment(order_id, payment_id);
        if (!isPaymentSuccessful) {
            return res.status(400).json({ message: "Payment verification failed." });
        }

        // Find the order in the database
        const order = await Order.findOne({ where: { order_id, user_id: userId } });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        await order.update({ payment_id, payment_status: "Successful" });

        console.log("Updated Order:", await Order.findOne({ where: { order_id } }));

        // Update User
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.update({ isPremium: true });

        const token = registerController.generateAccessToken(userId, undefined, true);
        res.status(202).json({
            success: true,
            message: "Transaction successful",
            token,
        });
    } catch (error) {
        console.error("Error updating transaction status:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update transaction status. Please try again.",
        });
    }
};

// Get user leaderboard details
// const getUserLeaderBoard = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();

//         // Object to aggregate expenses by user ID
//         const userAggregatedExpenses = {};

//         // Aggregate expenses for each user
//         expenses.forEach((expense) => {
//             if (userAggregatedExpenses[expense.userId]) {
//                 userAggregatedExpenses[expense.userId] += expense.expenseAmount;
//             } else {
//                 userAggregatedExpenses[expense.userId] = expense.expenseAmount;
//             }
//         });

//         // Prepare leaderboard details
//         const userLeaderBoardDetails = users.map((user) => ({
//             name: user.name,
//             total_cost: userAggregatedExpenses[user.id] || 0, // Default to 0 if no expenses
//         }));

//         // Sort the leaderboard by total cost in descending order
//         userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

//         // Send the leaderboard as JSON response
//         res.status(200).json(userLeaderBoardDetails);
//     } catch (error) {
//         console.error("Error fetching leaderboard:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
// const getUserLeaderBoard = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();

//         console.log("Fetched Users:", users.map(u => ({ id: u.id, name: u.name })));
//         console.log("Fetched Expenses:", expenses.map(e => ({ userId: e.userId, amount: e.expenseAmount })));

//         // Object to aggregate expenses by user ID
//         const userAggregatedExpenses = {};

//         // Aggregate expenses for each user
      

//         expenses.forEach((expense) => {
//             if (!expense.userId || !expense.amount) {
//                 console.log("Skipping expense due to missing fields:", expense);
//                 return;
//             }
        
//             if (userAggregatedExpenses[expense.userId]) {
//                 userAggregatedExpenses[expense.userId] += expense.amount;
//             } else {
//                 userAggregatedExpenses[expense.userId] = expense.amount;
//             }
//         });
        

//         console.log("Aggregated Expenses:", userAggregatedExpenses);

//         // Prepare leaderboard details
//         const userLeaderBoardDetails = users.map((user) => ({
//             name: user.name,
//             total_cost: userAggregatedExpenses[user.id] || 0, // Default to 0 if no expenses
//         }));

//         console.log("Final Leaderboard:", userLeaderBoardDetails);

//         // Sort the leaderboard by total cost in descending order
//         userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

//         // Send the leaderboard as JSON response
//         res.status(200).json(userLeaderBoardDetails);
//     } catch (error) {
//         console.error("Error fetching leaderboard:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// const getUserLeaderBoard = async (req, res) => {
//     try {
        
//         const users = await User.findAll({ attributes: ['id', 'name'] });

        
//         const userAggregatedExpenses = await Expense.findAll({
//             attributes: ['userId', [Sequelize.fn('sum', Sequelize.col('amount')), 'total_cost']],
//             group: ['userId']
//         });

//         // यूजर खर्चों को एक ऑब्जेक्ट में बदलना ताकि एक्सेस करना आसान हो
//         const expensesMap = {};
//         userAggregatedExpenses.forEach(expense => {
//             expensesMap[expense.userId] = expense.getDataValue('total_cost');
//         });

//         // लीडरबोर्ड डिटेल्स तैयार करना
//         let userLeaderBoardDetails = users.map(user => ({
//             name: user.name,
//             total_cost: expensesMap[user.id] || 0 // अगर खर्च नहीं है तो 0 सेट करें
//         }));

//         console.log("Final Leaderboard:", userLeaderBoardDetails);

//         // खर्च के आधार पर लीडरबोर्ड को सॉर्ट करना (descending order)
//         userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

//         // JSON response भेजना
//         res.status(200).json(userLeaderBoardDetails);
//     } catch (err) {
//         console.error("Error fetching leaderboard:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardofusers = await User.findAll({
            attributes: [
                'id', 
                'name', 
                [Sequelize.fn('sum', Sequelize.col('Expenses.amount')), 'total_cost']
            ],
            include: [
                {
                    model: Expense,
                    attributes: [] // कोई अतिरिक्त कॉलम न लें, केवल खर्चों का योग चाहिए
                }
            ],
            group: ['User.id'],
            order: [[Sequelize.literal('total_cost'), 'DESC']] // टोटल खर्च के अनुसार सॉर्ट करें
        });

        res.status(200).json(leaderboardofusers);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { purchasePremium, updateTransactionStatus, getUserLeaderBoard };
