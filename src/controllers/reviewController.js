const { NotFoundError, BadRequestError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

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
//
exports.getAllReviews = async (req, res) => {
  const gymId = req.params.gymId;

  const [results, metadata] = await sequelize.query(
    `
      SELECT reviews.id AS reviewId, review_description, number_of_stars, user_id, users.username, reviews.gym_id, gyms.gym_name FROM reviews
      LEFT JOIN gyms ON gyms.id = gym_id
      LEFT JOIN users ON users.id = user_id
      WHERE gym_id = $gymId;
      `,
    {
      bind: { gymId: gymId },
    }
  );
  if (!results || results.length == 0) {
    throw new NotFoundError("did not find reviews for that gym");
  }
  const gymResponse = {
    gymId: gymId,
    gymName: results[0].gym_name,
    reviews: results.map((reviews) => {
      return {
        details: reviews.review_description,
        rating: reviews.number_of_stars,
        writer: reviews.user_id,
      };
    }),
  };
  return res.json(gymResponse);
};
// Get review by id
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

// Create new review
exports.createNewReview = async (req, res) => {
  try {
    const { title, description, number_of_stars, fk_gym_id } = req.body;
    let userId = req.user?.userId;

    let [newReviewId] = await sequelize.query(
      `INSERT INTO review (title, description, number_of_stars, fk_gym_id, fk_user_id)  
VALUES 
($title, $description, $number_of_stars, $fk_gym_id, $fk_user_id) ;`,
      {
        bind: {
          title: title,
          description: description,
          number_of_stars: number_of_stars,
          fk_gym_id: fk_gym_id,
          fk_user_id: userId,
        },
        type: QueryTypes.INSERT,
      }
    );
    console.log(newReviewId);

    return res
      .setHeader(
        "Location",
        `${req.protocol}://${req.headers.host}/api/v1/review/${newReviewId}`
      )
      .sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update review (by id)
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
