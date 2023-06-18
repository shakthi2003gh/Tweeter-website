const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateSignin } = require("../models/user");

router.post("/", async (req, res) => {
  const { error, value } = validateSignin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isValidPassword = await bcrypt.compare(value.password, user.password);
  if (!isValidPassword)
    return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  const keys = [
    "_id",
    "name",
    "image",
    "email",
    "post_ids",
    "following",
    "saved_post_ids",
    "followers",
  ];
  res.header("x-tweeter-auth", token).send(_.pick(user, keys));
});

exports.auth = router;
