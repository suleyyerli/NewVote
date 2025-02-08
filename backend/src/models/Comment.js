const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Posts",
      key: "id",
    },
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Comment.associate = (models) => {
  Comment.belongsToMany(models.User, {
    through: "CommentLikes",
    as: "likedBy",
    foreignKey: "commentId",
  });
};

module.exports = Comment;
