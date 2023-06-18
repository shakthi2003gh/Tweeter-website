require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const debug = require("debug");

const app = express();
const startup = debug("startup:");
const dbugError = debug("error:");

const { posts } = require("./routers/posts");
const { users } = require("./routers/users");
const { auth } = require("./routers/auth");
const { error } = require("./middleware/error");

const PORT = process.env.PORT || 3001;
const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => {
    startup(`Listening on port ${PORT}...`);
  })
  .catch(() => {
    dbugError(`Could not connect to mongodb ${DB}...`);
  });

const origin = process.env.ORIGIN;
const corsOptions = {
  origin,
  optionsSuccessStatus: 200,
  exposedHeaders: "x-tweeter-auth",
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use("/posts", express.static("uploads/posts/"));
app.use("/profile", express.static("uploads/profile/"));

app.use(error);

module.exports = app.listen(PORT);
