const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");
const { uploadProfile } = require("../services/multer");
const { User, validateSignup, validateUpdateUser } = require("../models/user");
const { Post } = require("../models/post");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.send(user);
});

router.get("/:id", auth, validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).send("User not found.");

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error, value } = validateSignup(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isUserWithSameUserIdExist = await User.findOne({ email: value.email });
  if (isUserWithSameUserIdExist)
    return res.status(409).send("User with email already exists.");

  const salt = await bcrypt.genSalt(10);
  value.password = await bcrypt.hash(value.password, salt);

  const user = new User(value);
  await user.save();

  const token = user.generateAuthToken();
  const keys = ["_id", "name", "email", "post_ids", "following", "followers"];
  res.header("x-tweeter-auth", token).send(_.pick(user, keys));
});

router.patch("/", auth, uploadProfile, async (req, res) => {
  const { error, value } = validateUpdateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const filename = "profile/" + req.file?.filename;
  const updateUser = {
    ...value,
    image: req.file ? filename : undefined,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updateUser, {
    new: true,
  }).select("-password");
  if (!user) return res.status(404).send("User not found.");

  res.send(user);
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) return res.status(404).send("User not found.");

  console.log(user);

  user.post_ids.forEach(async (id) => {
    await Post.findByIdAndDelete(id);
  });

  res.removeHeader("x-tweeter-auth").send("User successfully deleted.");
});

exports.users = router;
