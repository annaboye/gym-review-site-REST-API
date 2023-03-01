require("dotenv").config();
require("express-async-errors");
const express = require("express");
// const apiRoutes = require("./routes");
// const { errorMiddleware } = require("./middleware/errorMiddleware");
// const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");

const { sequelize } = require("./database/config");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

// app.use("/api/v1", apiRoutes);

// app.use(notFoundMiddleware);
// app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(
        `Server is listening on ${
          process.env.NODE_ENV === "development" ? "http://localhost:" : "port "
        }${port}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

run();
