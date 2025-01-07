const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Comment = require('./commentModel'); // Import the Comment model

class Blog extends Model {}

Blog.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Blog',
  }
);

// Define associations
Blog.hasMany(Comment, { foreignKey: 'blogId', as: 'comments' });
Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

module.exports = Blog;
