const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Your database connection

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

module.exports = Comment;
