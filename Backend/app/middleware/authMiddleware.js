const jwt = require("jsonwebtoken");
const config = require("../config/app.config.js");
const db = require("../models/index.js");
const { mapFinderOptions } = require("sequelize/lib/utils");
const User = db.user;

module.exports = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  } else console.log(token);

  const decoded = jwt.verify(token.split(" ")[1],
            config.SECRET_KEY
            );
  
  const user = await User.findByPk(decoded.id);
  if (!user || user.tokenVersion !== decoded.tokenVersion) { // 🔥 Check tokenVersion
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
  console.log(user);
  req.user = user;
  next();
};

