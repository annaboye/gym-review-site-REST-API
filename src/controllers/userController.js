const { userRoles, gymRoles } = require("../constants/users");

const { NotFoundError, BadRequestError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const limit = Number(req.query?.limit || 10);
  const offset = Number(req.query.offset || 0);

  // if (req.user.role === userRoles.ADMIN) {
  const [users, metadata] = await sequelize.query(
    //metadata?
    `SELECT id, user_alias, email FROM user;`
    // {
    //   bind: { users }, //Ska man göra så här? Ska man ha bind på denna controller?
    //   type: QueryTypes.SELECT,
    // }
  ); //FRÅGA - vi skippar password antar jag, skippa även full_name? Har dock med user_alias här liksom på nästa controller, ska vi ha det?

  console.log(users);

  if (!users) throw new NotFoundError("Oh no, there are no registered users!");

  const [numberOfUsers] =
    await sequelize.query(`SELECT COUNT(*) AS number_of_users
    FROM user;;`);

  return res.json({
    data: users,
    metadata: {
      numberOfUsers: numberOfUsers,
      limit: limit,
      offset: offset,
      count: users.length,
    },
  });
  // } else {
  //   throw new UnauthorizedError("Sorry, you are not allowed to perform this action");
  // }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  // if (req.user.role === userRoles.USER) {
  const [user, metadata] = await sequelize.query(
    `SELECT id, user_alias, email FROM user WHERE id = $userId;`,
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );
  if (!user)
    throw new NotFoundError("Sorry, that user does not exist. Try again :)");
  return res.json(user);
  // } else {
  //   throw new UnauthorizedError("Sorry, you are not allowed to perform this action");
  // };
};

exports.createUser = async (req, res) => {
  //FRÅGA - ska vi ha denna eller bara skapa i authController?
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
