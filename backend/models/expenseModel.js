const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

class Expense extends Model {}

Expense.init(
  {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
    timestamps: true,
  }
);

module.exports = Expense;
