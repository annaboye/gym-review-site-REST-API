const { UnauthenticatedError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.getAllGyms = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(`SELECT * FROM gym`, {});

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymById = async (req, res) => {
  const gymId = req.params.gymId || req.body.gymId;

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM gym WHERE id = $gymId`,
      {
        bind: {
          gymId: gymId,
        },
      }
    );
    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createGym = async (req, res) => {
  try {
    return res.send("createGym");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymById = async (req, res) => {
  try {
    return res.send("updateGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteGymById = async (req, res) => {
  try {
    return res.send("deleteGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
