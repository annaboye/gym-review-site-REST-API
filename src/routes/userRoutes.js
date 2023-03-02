const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware"); //isauthenticated - kollar tokens //authorizeroles - kollar behörighet

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers); //lagt dessa middleware functions före vår controller, om de går igenom (anv blir autentiserad / authorized) så går man vidare till controller funktionen :)
//Viktigt att user först blir authenticated så vi får req.user vilken används därefter i userroles, annars existerar den inte (ännu).

router.get("/:userId", isAuthenticated, getUserById);
// router.get("/:userId", getUserById);

router.put("/:userId", isAuthenticated, updateUserById);
router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
