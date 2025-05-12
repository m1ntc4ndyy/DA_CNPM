module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'organizer', 'student'),
        allowNull: false,
        defaultValue: 'student'
      },
      studentId: {
        type: DataTypes.STRING,
        allowNull: true  // Only required for students
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }, 
      point :{
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      timestamps: true
    });
  
    User.associate = models => {
      // Organizer creates events
      User.hasMany(models.Event, {
        foreignKey: 'organizerId',
        as: 'organizedEvents'
      });
      
      // Student registers for events
      User.belongsToMany(models.Event, {
        through: models.Registration,
        as: 'registeredEvents',
        foreignKey: 'userId'
      });
      
      // Student attends events
      User.belongsToMany(models.Event, {
        through: models.Attendance,
        as: 'attendedEvents',
        foreignKey: 'userId'
      });
    };
  
    return User;
  };