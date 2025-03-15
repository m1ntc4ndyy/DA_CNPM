module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.ENUM("admin", "student", "organization"), allowNull: false },
    tokenVersion: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  return User;
};
