// const { User } = require("../models/user.model");
const { user } = require("../models/index");
var bcrypt = require("bcryptjs");

const { ParseAndPaginateUsers } = require('../helper/paging');
const { filterUsersName, filterUserId } = require("../helper/userFilter");

exports.listUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const page = parseInt(req.query.page) || 1;
    const filterName = req.query.username;
    const filterId = req.query.id;

    const users = await user.findAll();
    let filteredUser = users;

    if (filterName) {
      filteredUser = filterUsersName(filteredUser, filterName);
    }

    if (filterId) {
      filteredUser = filterUserId(filteredUser, filterId)
    }

    const paginatedUsers = ParseAndPaginateUsers(filteredUser, limit, page);
    res.json({
      message: "User List",
      data: paginatedUsers,
      length: users.length,
      pagedlength: paginatedUsers.length,

    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const temp = await user.findByPk(id);

    res.json({
      message: "User Detail",
      data: temp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await user.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      message: "User Soft Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, password, address } = req.body;
    const temp = await user.findByPk(id);
    
    await temp.update({
      username: username,
      email: email,
      password: password && bcrypt.hashSync(password, 8),
      address: address
    })
    await temp.save();

    res.json({
      message: "User Updated",
      data: temp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
