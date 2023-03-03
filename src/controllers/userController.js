const { userRoles, gymRoles } = require("../constants/users");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  try {
    const limit = Number(req.query?.limit || 10);
    const offset = Number(req.query.offset || 0);

    if (req.user.role === userRoles.ADMIN) {
      const [users, userMetaData] = await sequelize.query(
        `SELECT id, full_name, user_alias, email FROM user ORDER BY id LIMIT $limit OFFSET $offset;`,
        {
          bind: {
            limit: limit,
            offset: offset,
          },
        }
      );
      if (!users)
        throw new NotFoundError("Oh no, there are no registered users!");

      const [numberOfUsers] = await sequelize.query(
        `SELECT COUNT(*) AS number_of_users FROM user;`
      );

      return res.json({
        data: users,
        metadata: {
          // @ts-ignore
          numberOfUsers: numberOfUsers[0].number_of_users,
          limit: limit,
          offset: offset,
          count: users.length,
        },
      });
    } else {
      throw new UnauthorizedError(
        "Sorry, you are not allowed to perform this action"
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const [userToGet, userToGetMetaData] = await sequelize.query(
      `SELECT id, user_alias, email FROM user WHERE id = $userId;`,
      {
        bind: { userId },
        type: QueryTypes.SELECT,
      }
    );
    if (!userToGet)
      throw new NotFoundError("Sorry, that user does not exist. Try again :)");
    return res.json(userToGet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { full_name, user_alias, email, password } = req.body;

    if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    const [userToUpdate, userToUpdateMetaData] = await sequelize.query(
      `UPDATE user 
      SET full_name = $full_name, user_alias = $user_alias, email = $email, password = $password
      WHERE id = $userId;`,
      {
        bind: {
          full_name: full_name,
          user_alias: user_alias,
          email: email,
          password: password,
          userId: userId,
        },
      }
    );
    return res.status(201).json({ message: "Success! User is now updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    const [userExists, userExistsMetaData] = await sequelize.query(
      `SELECT * FROM user WHERE id = $userId;`,
      {
        bind: { userId },
      }
    );
    if (!userExists || !userExists[0]) {
      throw new NotFoundError("That user does not exist");
    } else {
      const [userHasReviews, userhasReviewsMetaData] = await sequelize.query(
        //FRÅGA: variaben userHasReviews används inte, ska den finnas ändå? Eller ska man direkt köra await sequelize.query?
        `DELETE FROM review WHERE fk_user_id = $userId;`,
        {
          bind: { userId },
        }
      );
    }
    const [results, resultsMetaData] = await sequelize.query(
      //FRÅGA: variaben results används inte, ska den finnas ändå?

      `DELETE FROM user WHERE id = $userId RETURNING *;`,
      {
        bind: { userId },
      }
    );
    return res.status(200).json({ message: "Success, user was deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
