const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("gymDb", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "gymDb.sqlite"),
});

module.exports = {
  sequelize,
};
