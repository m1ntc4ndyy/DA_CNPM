const jwt = require("jsonwebtoken");
const config = require("../config/app.config.js");
const db = require("../models/index.js");
const { mapFinderOptions } = require("sequelize/lib/utils");
const User = db.user;

module.exports = async (req, res, next) => {
  try {

    let token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
    
    const decoded = jwt.verify(token.split(" ")[1],config.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findByPk(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) { // 🔥 Check tokenVersion
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }

};

