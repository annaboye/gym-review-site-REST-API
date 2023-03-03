const { UnauthenticatedError, BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  const { full_name, user_alias, password, email } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [existingUser, existingUserMetadata] = await sequelize.query(
    `SELECT id FROM user LIMIT 1`
  );

  //FUNKAR INTE - VARFÖR?
  // const [aliasExists, aliasExistsMetadata] = await sequelize.query(
  //   `SELECT COUNT(*) from user WHERE user_alias = $user_alias`,
  //   {
  //     bind: { user_alias },
  //   }
  // );
  // console.log("Users with that alias: ", aliasExists);

  // const [emailExists, emailExistsMetadata] = await sequelize.query(
  //   `SELECT COUNT(*) from user WHERE email = $email`,
  //   {
  //     bind: { email },
  //   }
  // );
  // console.log("Users with that email: ", emailExists);

  // if (aliasExists || emailExists) {
  //   throw new BadRequestError(
  //     "Please check your details, either that alias not available, or you already have an account."
  //   );
  // }

  if (!existingUser || existingUser.length < 1) {
    await sequelize.query(
      `INSERT INTO user (full_name, user_alias, email, password, is_admin) VALUES ($full_name, $user_alias, $email, $password, TRUE)`,
      {
        bind: {
          full_name: full_name,
          user_alias: user_alias,
          email: email,
          password: hashedpassword,
        },
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
  const { email, password: canditatePassword } = req.body; // CandidatePassword är en variabel vi skapar.

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
    // @ts-ignore
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  //skapa datan i.e. payloaden som vi vill att vår jwt token ska innehålla: (obs lägg ej in känslig info här iom alla jwt webtokens kan avkrypteras enkelt tex på jwt.io)
  //inkludera bara data i vår payload som vi inte har ngt emot att alla ser! obs!
  const jwtPayload = {
    // @ts-ignore
    userId: user.id,
    // @ts-ignore
    userAlias: user.user_alias,
    // @ts-ignore
    email: user.email,
    role: user["is_admin"] === 1 ? userRoles.ADMIN : userRoles.USER,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1d" /* 1h */,
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
