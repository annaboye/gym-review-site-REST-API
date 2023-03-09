const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { review } = require("../data/review");

exports.getAllReviews = async (req, res) => {
  const gymId = req.query.gymId;
  const userId = req.query.userId;
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);

  if (gymId) {
    const [results, metadata] = await sequelize.query(
      `
    SELECT * FROM review WHERE fk_gym_id = $gymId LIMIT $limit OFFSET $offset;
      `,
      {
        bind: {
          gymId: gymId,
          limit: limit,
          offset: offset,
        },
      }
    );
    if (!results || results.length == 0) {
      throw new NotFoundError("did not find reviews for that gym");
    }

    return res.json({
      data: results,
      metadata: {
        limit: limit,
        offset: offset,
      },
    });
  }

  if (userId) {
    const [results, metadata] = await sequelize.query(
      `
    SELECT * FROM review WHERE fk_user_id = $userId LIMIT $limit OFFSET $offset;
      `,
      {
        bind: {
          userId: userId,
          limit: limit,
          offset: offset,
        },
      }
    );
    if (!results || results.length == 0) {
      throw new NotFoundError("did not find reviews for that gym");
    }

    return res.json({
      data: results,
      metadata: {
        limit: limit,
        offset: offset,
      },
    });
  }

  if (!userId && !gymId) {
    const [results, metadata] = await sequelize.query(
      `
    SELECT * FROM review LIMIT $limit OFFSET $offset;
      `,
      {
        bind: {
          limit: limit,
          offset: offset,
        },
      }
    );
    if (!results || results.length == 0) {
      throw new NotFoundError("did not find reviews for that gym");
    }

    return res.json({
      data: results,
      metadata: {
        limit: limit,
        offset: offset,
      },
    });
  }
};
// Get review by id
exports.getReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    const [results, metadata] = await sequelize.query(
      `
    SELECT * FROM review WHERE id = $reviewId;
      `,
      {
        bind: {
          reviewId: reviewId,
        },
      }
    );
    if (!results || results.length == 0) {
      throw new NotFoundError("did not find any review with that id");
    }

    return res.json({
      data: results,
    });
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
      .sendStatus(201); //lägga till .json(newReview) för att även skicka tillbaka jsonobjekt med det nyskapade objektet new Review?
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update review (by id)
exports.updateReviewById = async (req, res) => {
  const { title, description, number_of_stars } = req.body;
  const reviewId = req.params.reviewId;
  try {
    const [review, metadata] = await sequelize.query(
      `
    SELECT fk_user_id FROM review WHERE id = $reviewId;
      `,
      {
        bind: {
          reviewId: reviewId,
        },
      }
    );
    console.log(review);
    if (!review || review.length == 0) {
      throw new NotFoundError("did not find any review with that id");
    }
    // @ts-ignore
    if (review[0].fk_user_id != req.user?.userId) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const [updatedReview] = await sequelize.query(
      `UPDATE review SET title= $title, description = $description, number_of_stars = $number_of_stars
      WHERE id = $reviewId RETURNING *;`,
      {
        bind: {
          title: title,
          description: description,
          number_of_stars: number_of_stars,
          reviewId: reviewId,
        },
      }
    );

    console.log(updatedReview[0]);

    return res.status(200).json(updatedReview[0]);
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
    const reviewId = req.params.reviewId;
    const [review, metadata] = await sequelize.query(
      `
    SELECT fk_user_id FROM review WHERE id = $reviewId;
      `,
      {
        bind: {
          reviewId: reviewId,
        },
      }
    );
    console.log(review);
    if (!review || review.length == 0) {
      throw new NotFoundError("did not find any review with that id");
    }

    if (
      // @ts-ignore
      review[0].fk_user_id != req.user?.userId &&
      // @ts-ignore
      req.user.role !== userRoles.ADMIN
    ) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    await sequelize.query(
      `DELETE FROM review WHERE id = $reviewId RETURNING *;`,
      {
        bind: { reviewId },
      }
    );

    return res.status(200).json({ message: "review successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
