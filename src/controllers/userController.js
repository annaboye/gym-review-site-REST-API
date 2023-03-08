const { userRoles } = require("../constants/users");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { text } = require("express");
const bcrypt = require("bcrypt");

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
      console.log("Users: ", users);

      if (!users)
        throw new NotFoundError("Oh no, there are no registered users!");

      const [numberOfUsers] = await sequelize.query(
        `SELECT COUNT(*) AS number_of_users FROM user;`
      );
      // @ts-ignore
      console.log("Number of users: ", numberOfUsers[0].number_of_users);

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

    if (isNaN(userId)) {
      throw new BadRequestError("User ID must be a number! Try again.");
    }

    if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const [userToGet, userToGetMetaData] = await sequelize.query(
      `SELECT id, full_name, user_alias, email FROM user WHERE id = $userId;`,
      {
        bind: { userId },
        type: QueryTypes.SELECT,
      }
    );
    console.log("User to get", userToGet);

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

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    if (isNaN(userId)) {
      throw new BadRequestError("User ID must be a number! Try again.");
    }

    if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    if (full_name == "" || user_alias == "" || email == "" || password == "") {
      throw new BadRequestError(
        "Input fields to update cannot be empty! Try again."
      );
    }

    if (typeof full_name !== "string") {
      throw new BadRequestError("Name must be a string! Try again.");
    }

    if (full_name.length < 3 || full_name.length > 60) {
      throw new BadRequestError(
        "Full name must be at least 3 characters (and max 60 characters)."
      );
    }

    if (typeof user_alias !== "string") {
      throw new BadRequestError("User alias must be a string! Try again.");
    }
    if (user_alias.length < 3 || user_alias.length > 30) {
      throw new BadRequestError(
        "User alias must be at least 3 characters (and max 30 characters)."
      );
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      throw new BadRequestError("User email must be an email! Try again.");
    }

    if (typeof password !== "string") {
      throw new BadRequestError("Password must be a string! Try again.");
    }
    if (password.length < 6) {
      throw new BadRequestError(
        "Password must be at least 6 characters. Try again."
      );
    }

    await sequelize.query(
      `UPDATE user 
      SET full_name = $full_name, user_alias = $user_alias, email = $email, password = $hashedpassword
      WHERE id = $userId;`,
      {
        bind: {
          full_name: full_name,
          user_alias: user_alias,
          email: email,
          hashedpassword: hashedpassword,
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

    if (isNaN(userId)) {
      throw new BadRequestError("User ID must be a number! Try again.");
    }

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
      const [userReviewsDeleted, userReviewsDeletedMetaData] =
        await sequelize.query(
          `DELETE FROM review WHERE fk_user_id = $userId;`,
          {
            bind: { userId },
          }
        );
      console.log("User reviews after deletion:", userReviewsDeleted.length);
    }

    const [deleteUser, resultsMetaData] = await sequelize.query(
      `DELETE FROM user WHERE id = $userId RETURNING *;`,
      {
        bind: { userId },
      }
    );
    console.log("Deleted user was:", deleteUser[0]);

    return res.status(200).json({ message: "Success, user was deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
