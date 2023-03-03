const { body } = require("express-validator");

//express validator ger oss möjlighet till detta sätt att validera vår req.body med express inbyggda methods.
exports.registerSchema = [
  body("full_name").isString().withMessage("Full name must be a string."),
  body("full_name")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 60 })
    .withMessage(
      "Full name must be at least 3 characters (and max 60 characters)."
    ),

  body("user_alias").isString().withMessage("User alias must be a string."),
  body("user_alias")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Sorry, your user alias must be between 3 and 50 characters long. Try again!"
    ),

  body("email").isEmail().withMessage("You must provide a valid email address"),

  body("password").isString().withMessage("Password must be a string."),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage(
      "You must provide a password that is at least 6 characters long"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];
