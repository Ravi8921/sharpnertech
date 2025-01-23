const Razorpay = require('razorpay');
const Order = require('../models/orderModel'); // Assuming you have the Order model set up
require('dotenv').config(); // To use environment variables

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const purchasePremium = async (req, res) => {
    try {
        // Ensure `req.user.id` exists
        const userId = req.user.id;
        if (!userId) {
            console.log("User ID is missing in the request.");
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


const updateTransactionStatus = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!order_id || !payment_id) {
            console.log("Order ID or Payment ID is missing.");
            return res.status(400).json({ message: "Order ID and Payment ID are required." });
        }

        // Find the order in the database
        const order = await Order.findOne({ where: { order_id, user_id: userId } });
        if (!order) {
            console.log("Order not found or does not belong to the user.");
            return res.status(404).json({ message: "Order not found." });
        }

        // Update the payment status and payment ID
        order.payment_status = "completed";
        order.payment_id = payment_id;
        await order.save();

        res.status(200).json({ message: "Transaction status updated successfully." });
    } catch (error) {
        console.error("Error updating transaction status:", error.message);
        res.status(500).json({ message: "Failed to update transaction status. Please try again." });
    }
};

module.exports = { purchasePremium, updateTransactionStatus };
