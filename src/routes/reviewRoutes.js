const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  createNewReview,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/reviewController");

const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", getAllReviews);
router.get("/:reviewId", getReviewById);
router.post("/", isAuthenticated, createNewReview);
router.put("/:reviewId", isAuthenticated, updateReviewById);
router.delete("/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
