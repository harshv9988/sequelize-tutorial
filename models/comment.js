module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    title: DataTypes.STRING,
    commentableId: DataTypes.INTEGER,
    commentableType: DataTypes.STRING,
  });

  return Comment;
};
