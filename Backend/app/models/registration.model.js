const User = require("./user.model");
const Event = require("./event.model");
module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define("Registration", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      event_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Event,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      attended: {
        type: DataTypes.BOOLEAN, // True if the user attended
        defaultValue: false,
      },
    });
  
    return Registration;
  };
  