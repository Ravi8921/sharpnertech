const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const User = require("./registerModel");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "Unique Razorpay order ID (e.g., order_ABC123)",
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: "Razorpay payment ID for successful transactions",
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
 
}, {
    tableName: "orders",
    timestamps: true, 
    comment: "Stores information about Razorpay orders and their statuses",
});

// Associations
User.hasMany(Order, { foreignKey: "user_id" }); 
Order.belongsTo(User, { foreignKey: "user_id" }); 

module.exports = Order;
