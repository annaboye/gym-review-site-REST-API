const { userRoles } = require("../constants/users");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  try {
    return res.send("Get all users"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    return res.send("Get user by Id"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    return res.send("Create user"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    return res.send("update user"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    return res.send("Delete user"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    // Send the following response if error occurred
    return res.status(500).json({ message: error.message });
  }
};
