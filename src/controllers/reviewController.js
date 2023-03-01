const { NotFoundError, BadRequestError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

// GET /api/v1/reviews - Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    return res.send("Get all reviews"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/v1/reviews/:reviewId - Get review by id
exports.getReviewById = async (req, res) => {
  try {
    return res.send("Get review by id"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/v1/reviews - Create new review
exports.createNewReview = async (req, res) => {
  try {
    return res.send("Create new review"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/v1/reviews/:reviewId - Update review (by id)
exports.updateReviewById = async (req, res) => {
  try {
    return res.send("Update review"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete review (by id)
exports.deleteReviewById = async (req, res) => {
  try {
    return res.send("Delete review"); //scaffold return m meddelande
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
