const { UnauthenticatedError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  const { full_name, user_alias, password, email } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [results, metadata] = await sequelize.query(
    `SELECT id FROM user LIMIT 1`
  );

  if (!results || results.length < 1) {
    await sequelize.query(
      `INSERT INTO user (full_name, user_alias, email, password, is_admin) VALUES ($full_name, $user_alias, $email, $password, TRUE)`,
      {
        bind: {
          full_name: full_name,
          user_alias: user_alias,
          password: hashedpassword,
          email: email,
        }, //FRÅGA - vill vi ha bind på full_name och use_alias?
      }
    );
  } else {
    await sequelize.query(
      `INSERT INTO user (full_name, user_alias, email, password, is_admin) VALUES ($full_name, $user_alias, $email, $password, FALSE)`,
      {
        bind: {
          full_name: full_name,
          user_alias: user_alias,
          password: hashedpassword,
          email: email,
        },
      }
    );
  }

  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {
  const { email, password: canditatePassword } = req.body; // FRÅGA: förklaring på candidatePassword?

  const [user, metadata] = await sequelize.query(
    `SELECT * FROM user WHERE email = $email LIMIT 1;`,
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  console.log(user);

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user["is_admin"] === 1 ? userRoles.ADMIN : userRoles.USER,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h" /* 1d */,
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
