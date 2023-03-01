const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");

const {
  getAllGyms,
  getGymById,
  createGym,
  updateGymById,
  deleteGymById,
} = require("../controllers/gymController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", getAllGyms);
router.get("/:gymId", getGymById);
router.post("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), createGym);
router.put(
  "/:gymId",
  isAuthenticated,
  authorizeRoles(userRoles.ADMIN),
  updateGymById
);
router.delete(
  "/:gymId",
  isAuthenticated,
  authorizeRoles(userRoles.ADMIN),
  deleteGymById
);
module.exports = router;
