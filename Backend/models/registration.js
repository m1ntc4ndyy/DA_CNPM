module.exports = (sequelize, DataTypes) => {
    const Registration = sequelize.define('Registration', {
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
      registrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
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
    Registration.associate = models => {
      Registration.belongsTo(models.Event, {
          foreignKey: 'eventId',
          as: 'event'
      });
  
      Registration.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
      });
    };
    return Registration;
  };