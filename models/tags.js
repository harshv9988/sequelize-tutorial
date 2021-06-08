module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("tags", {
    name: DataTypes.STRING,
  });

  return Tags;
};
