module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define("video", {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  });

  return Video;
};
