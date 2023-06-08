const router = require("express").Router();
const { uploadPost } = require("../services/multer");
const { Post, validatePost } = require("../models/post");
const { validateComment } = require("../models/comment");
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

router.post("/", uploadPost.single("image"), async (req, res) => {
  // > placeholder
  req.user = {
    _id: "354544545454",
    name: "shakthi",
    isAdmin: true,
  };

  const { error, value } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const filename = "posts/" + req.file.filename;
  const newPost = {
    user: req.user,
    content: {
      text: value.text,
      image: filename,
    },
    isEveryOneCanReply: value.isEveryOneCanReply,
  };

  const post = await Post(newPost);
  await post.save();

  res.send(post);
});

router.post("/:id/comment", validateObjectId, async (req, res) => {
  // > placeholder
  req.user = {
    _id: "354544545454",
    name: "shakthi",
    isAdmin: true,
  };

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

router.delete("/:id", validateObjectId, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(400).send("Post with given id does not exist.");

  res.send(post);
});

exports.posts = router;
