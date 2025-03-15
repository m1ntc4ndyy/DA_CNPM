module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
      student_id: DataTypes.INTEGER,
      event_id: DataTypes.INTEGER,
      checkin_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
  
    return Attendance;
  };
  