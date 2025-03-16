const express = require("express");
const cors = require("cors");
const config = require("./app/config/app.config");
const bcrypt = require("bcryptjs");
const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");

const User = db.user;
const Event = db.event;
db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");
  initial();
});
// db.sequelize.sync();

async function initial() {
  const count = await User.count();
  if (count !== 0) return;
  await User.create({
    name: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("1", 8),
    role: "admin",
  });

  await User.create({
    name: "student",
    email: "student@gmail.com",
    password: bcrypt.hashSync("2", 8),
    role: "student",  
  });

  await User.create({
    name: "organizer",
    email: "3",
    password: bcrypt.hashSync("3", 8),
    role: "organization",
  });

}

// simple route
app.get("/", (req, res) => {
  res.json({ message: `Welcome to ${config.APP_NAME}` });
});

// routes
// authentication routes
require("./app/routes/auth.routes")(app);

// user routes
require("./app/routes/user.routes")(app);

//event routes
require("./app/routes/event.routes")(app);

//registration routes
require("./app/routes/registration.routes")(app);
// set port, listen for requests
const PORT = config.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
