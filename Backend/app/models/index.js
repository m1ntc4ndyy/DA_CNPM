const config = require("../config/db.config");
const {DataTypes, Sequelize} = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, DataTypes);
db.event = require("./event.model.js")(sequelize, DataTypes);
db.registration = require("./registration.model.js")(sequelize, DataTypes);
db.attendance = require("./attendance.model.js")(sequelize, DataTypes);

//org event
db.user.hasMany(db.event, {
  foreignKey: "created_by",
  as: "events"
});

db.event.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "organization"
});

//event registration

db.user.belongsToMany(db.event, {
  through: db.registration,
  // as: "registrated events",
  foreignKey: "student_id"
});
db.event.belongsToMany(db.user, {
  through: db.registration,
  // as: "registrated students",
  foreignKey: "event_id"
});


//event attendance

db.user.belongsToMany(db.event, {
  through: db.attendance,
  as: "attended events",
  foreignKey: "student_id"
});
db.event.belongsToMany(db.user, {
  through: db.attendance,
  as: "attended students",
  foreignKey: "event_id"
});

db.registration.belongsTo(db.user, {
  foreignKey: "student_id",

});
db.registration.belongsTo(db.event, {
  foreignKey: "event_id",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
