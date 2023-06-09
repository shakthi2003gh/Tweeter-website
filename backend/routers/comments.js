const router = require("express").Router();
const { Post } = require("../models/post");
const { validateComment } = require("../models/comment");
const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");

router.post("/:id", auth, validateObjectId, async (req, res) => {
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

exports.comments = router;
