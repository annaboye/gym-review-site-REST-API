const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validation/validationSchemas");
const { validate } = require("../middleware/validation/validationMiddleware");

router.post("/register", validate(registerSchema), register); //validate middleware dit vi skickar in registerschema - en array av saker som hör till registrering av nya anv, saker som ska valideras.
router.post("/login", validate(loginSchema), login);

module.exports = router;
