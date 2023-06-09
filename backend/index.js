require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const debug = require("debug");

const app = express();
const startup = debug("startup:");
const dbugError = debug("error:");

const { posts } = require("./routers/posts");
const { comments } = require("./routers/comments");

const PORT = process.env.PORT || 3001;
const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT);
    startup(`Listening on port ${PORT}...`);
  })
  .catch(() => {
    dbugError(`Could not connect to mongodb ${DB}...`);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/comment", comments);
app.use("/api/posts", posts);

app.use("/posts", express.static("uploads/posts/"));
app.use("/user", express.static("uploads/profile/"));
