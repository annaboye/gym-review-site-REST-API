const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const gymRoutes = require("./gymRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/gyms", gymRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);

module.exports = router;
