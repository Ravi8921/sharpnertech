const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validates the format of the email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Optional: specify table name explicitly
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = User;
