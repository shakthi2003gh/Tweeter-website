const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");
const { uploadProfile } = require("../services/multer");
const { s3UploadProfile } = require("../services/awsS3");
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
  const keys = [
    "_id",
    "name",
    "image",
    "email",
    "post_ids",
    "saved_post_ids",
    "following",
    "followers",
  ];
  res.header("x-tweeter-auth", token).send(_.pick(user, keys));
});

router.post("/:id/follow", auth, validateObjectId, async (req, res) => {
  if (req.user._id === req.params.id)
    return res.status(400).send("User cannot follow themself.");

  const user = await User.findById(req.user._id);
  const otherUser = await User.findById(req.params.id);
  if (!otherUser) return res.status(404).send("User not found.");

  if (user.following.user_ids.includes(otherUser._id))
    return res.status(409).send("User already following user with given id.");

  user.following.user_ids.push(otherUser._id);
  user.following.count = user.following.user_ids.length;

  otherUser.followers.user_ids.push(req.user._id);
  otherUser.followers.count = otherUser.followers.user_ids.length;

  await user.save();
  await otherUser.save();

  res.sendStatus(204);
});

router.post("/:id/unfollow", auth, validateObjectId, async (req, res) => {
  if (req.user._id === req.params.id)
    return res.status(400).send("User cannot unfollow themself.");

  const user = await User.findById(req.user._id);
  const otherUser = await User.findById(req.params.id);
  if (!otherUser) return res.status(404).send("User not found.");

  if (!user.following.user_ids.includes(otherUser._id))
    return res.status(409).send("User not following user with given id.");

  const FollowingIdIndex = user.following.user_ids.indexOf(otherUser._id);
  user.following.user_ids.splice(FollowingIdIndex, 1);
  user.following.count = user.following.user_ids.length;

  const FollowersIdIndex = otherUser.followers.user_ids.indexOf(user._id);
  otherUser.followers.user_ids.splice(FollowersIdIndex, 1);
  otherUser.followers.count = otherUser.followers.user_ids.length;

  await user.save();
  await otherUser.save();

  res.sendStatus(204);
});

router.patch("/", auth, uploadProfile, s3UploadProfile, async (req, res) => {
  const { error, value } = validateUpdateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updateUser = {
    ...value,
    image: value.image || undefined,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updateUser, {
    new: true,
  }).select("-password");

  res.send(user);
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  user.post_ids.forEach(async (id) => {
    await Post.findByIdAndDelete(id);
  });

  res.send("User successfully deleted.");
});

exports.users = router;
