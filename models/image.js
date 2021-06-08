module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("images", {
    title: DataTypes.STRING,
    url: DataTypes.STRING,
  });

  return Image;
};
