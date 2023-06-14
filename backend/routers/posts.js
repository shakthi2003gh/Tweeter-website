const router = require("express").Router();
const { uploadPost } = require("../services/multer");
const { User } = require("../models/user");
const { Post, validatePost } = require("../models/post");
const { validateComment } = require("../models/comment");
const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");

router.get("/", async (_, res) => {
  const posts = await Post.find();

  res.send(posts);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  res.send(post);
});

router.get("/:id/comments", validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  res.send(post.comments);
});

router.post("/", auth, uploadPost, async (req, res) => {
  const { error, value } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const filename = "posts/" + req.file?.filename;
  const newPost = {
    user: req.user,
    content: {
      text: value.text,
      image: req.file ? filename : undefined,
    },
    isEveryOneCanReply: value.isEveryOneCanReply,
  };

  const post = new Post(newPost);
  await post.save();

  const user = await User.findById(post.user._id);
  user.post_ids.push(post._id);
  await user.save();

  res.send(post);
});

router.post("/:id/comment", auth, validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  const { error, value } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = {
    user: req.user,
    ...value,
  };

  post.comments.push(comment);
  await post.save();

  res.send({ post_id: post._id, comment });
});

router.post("/:id/like", auth, validateObjectId, async (req, res) => {
  const id = req.user._id;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  if (post.user.id === id)
    return res.status(403).send("User cannot like their own post");

  if (post.likes.user_ids.includes(id))
    return res.status(409).send("User already liked this post.");

  post.likes.user_ids.push(id);
  post.likes.count = post.likes.user_ids.length;

  await post.save();
  res.sendStatus(204);
});

router.post("/:id/unlike", auth, validateObjectId, async (req, res) => {
  const id = req.user._id;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  if (post.user.id === id)
    return res.status(403).send("User cannot unlike their own post");

  if (!post.likes.user_ids.includes(id))
    return res.status(409).send("User not liked this post.");

  const index = post.likes.user_ids.indexOf(id);
  post.likes.user_ids.splice(index, 1);
  post.likes.count = post.likes.user_ids.length;

  await post.save();
  res.sendStatus(204);
});

router.post("/:id/save", auth, validateObjectId, async (req, res) => {
  const id = req.user._id;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  if (post.user.id === id)
    return res.status(403).send("User cannot save their own post");

  if (post.saved.user_ids.includes(id))
    return res.status(409).send("User already saved this post.");

  post.saved.user_ids.push(id);
  post.saved.count = post.saved.user_ids.length;

  const user = await User.findById(id);
  user.saved_post_ids.push(post._id);

  await user.save();
  await post.save();

  res.sendStatus(204);
});

router.post("/:id/unsave", auth, validateObjectId, async (req, res) => {
  const id = req.user._id;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found.");

  if (post.user.id === id)
    return res.status(403).send("User cannot unsave their own post");

  if (!post.saved.user_ids.includes(id))
    return res.status(409).send("User not saved this post.");

  const savedUserIdIndex = post.saved.user_ids.indexOf(id);
  post.saved.user_ids.splice(savedUserIdIndex, 1);
  post.saved.count = post.saved.user_ids.length;

  const user = await User.findById(id);
  const savedPostIdIndex = user.saved_post_ids.indexOf(id);
  user.saved_post_ids.splice(savedPostIdIndex, 1);

  await user.save();
  await post.save();

  res.sendStatus(204);
});

router.delete("/:id", auth, validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post with given id does not exist.");

  if (post.user.id !== req.user._id)
    return res
      .status(403)
      .send("User do not have permission to delete this post.");

  await Post.findByIdAndDelete(post._id);

  const user = await User.findById(post.user._id);
  const index = user.post_ids.indexOf(post._id);
  user.post_ids.splice(index, 1);
  await user.save();

  res.send(post);
});

exports.posts = router;
