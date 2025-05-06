module.exports = (sequelize, DataTypes) => {
    const QRCode = sequelize.define('QRCode', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
      timestamps: true
    });
  
    QRCode.associate = models => {
      QRCode.belongsTo(models.Event, {
        foreignKey: 'eventId',
        as: 'event'
      });
    };
  
    return QRCode;
  };
  