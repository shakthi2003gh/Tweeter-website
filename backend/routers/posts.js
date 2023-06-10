const router = require("express").Router();
const { uploadPost } = require("../services/multer");
const { User } = require("../models/user");
const { Post, validatePost } = require("../models/post");
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

router.delete("/:id", auth, validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post with given id does not exist.");

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
