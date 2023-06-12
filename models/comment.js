"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log(models);
      Comment.belongsTo(models.User, { foreignKey: "userId" });
      Comment.belongsTo(models.blogPosts, { foreignKey: "blogPostId" });
    }
  }
  Comment.init(
    {
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      blogPostId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "comments",
    }
  );
  return Comment;
};
