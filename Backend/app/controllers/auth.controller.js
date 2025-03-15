const db = require("../models");
const config = require("../config/app.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    let user = await User.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (req.body.roles) {
      let roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          }
        }
      });
      {
        user.setRoles(roles)
        res.status(201).send({ message: "User registered successfully!" });
      
      };
    }
    else {
      // user role = 1
      user.setRoles([1])
      await res.status(201).send({ message: "User registered successfully!" });
      ;
    }

  }
  catch (err) {
    res.status(500).send({ message: err.message });
  };
};

exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role, tokenVersion: user.tokenVersion}, config.SECRET_KEY, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: config.TIME, // 24 hours
    });

    res.status(200).send({
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  }

  catch (err) {
    res.status(500).send({ message: err.message });
 };
};

exports.signout = async (req, res) => {
  try {
    console.log(req.user);
    await User.update(
      { tokenVersion: req.user.tokenVersion + 1 }, // 🔥 Invalidate old tokens
      { where: { id: req.user.id } }
    );

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." , error: error.message});
  }
};