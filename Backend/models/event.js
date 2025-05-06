module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      registrationDeadline: {
        type: DataTypes.DATE,
        allowNull: false
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      score : {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'canceled', 'completed'),
        defaultValue: 'draft'
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      organizerId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
      timestamps: true
    }
  );
  
    Event.associate = models => {
      // Event belongs to an organizer
      Event.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'organizer'
      });
      
      // Event has many registrations
      Event.belongsToMany(models.User, {
        through: models.Registration,
        as: 'registeredUsers',
        foreignKey: 'eventId'
      });

    //   Event.hasMany(models.Registration, {
    //     foreignKey: 'eventId',
    //     as: 'registrations'
    // });
      
      // Event has many attendances
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        as: 'attendees',
        foreignKey: 'eventId'
      });
      
      // Event has many QR codes
      Event.hasMany(models.QRCode, {
        foreignKey: 'eventId',
        as: 'qrCodes'
      });
    };
  
    return Event;
  };
  