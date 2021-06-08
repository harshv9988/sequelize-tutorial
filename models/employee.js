module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employee",
    {
      name: DataTypes.STRING,
    },
    {
      paranoid: true,
      deletedAt: "softDelete", //custom filed
    }
  );

  return Employee;
};
