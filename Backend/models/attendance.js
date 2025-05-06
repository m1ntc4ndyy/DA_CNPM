module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      checkInTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      qrCodeId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'eventId']
        }
      ]
    });
    Attendance.associate = models => {
      Attendance.belongsTo(models.Event, {
          foreignKey: 'eventId',
          as: 'event'
      });
  
      Attendance.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
      });
    };
    return Attendance;
  };