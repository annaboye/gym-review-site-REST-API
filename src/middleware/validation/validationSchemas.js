const { body } = require("express-validator");

//express validator ger oss möjlighet till detta sätt att validera vår req.body med express inbyggda methods.
exports.registerSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"), //with message = custom meddelande vi kan välja att skicka med.
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage(
      "You must provide a password that is at least 6 characters long"
    ),
  body("user_alias") //lagt till detta för vår gym app.
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Sorry, your user alias must be between 3 and 50 characters long. Try again!"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];
