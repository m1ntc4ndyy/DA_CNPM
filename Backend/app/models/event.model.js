module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      time: DataTypes.STRING,
      attendees : { type: DataTypes.INTEGER, defaultValue: 0 },
      maxAttendees: DataTypes.INTEGER,
      location: DataTypes.STRING,
      status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
      created_by: DataTypes.INTEGER, // Organization ID
    });
  
    return Event;
  };
  