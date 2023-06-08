const mongoose = require("mongoose");
const Joi = require("joi");
const { Comment } = require("./comment");

const schema = new mongoose.Schema(
  {
    user: {
      type: {
        _id: mongoose.Types.ObjectId,
        name: String,
        image: String,
      },
      required: true,
    },
    content: {
      text: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 400,
      },
      image: String,
    },
    comments: {
      type: [Comment.schema],
      default: [],
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
    },
    saved: {
      count: {
        type: Number,
        default: 0,
      },
    },
    isEveryOneCanReply: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

function validatePost(post) {
  const schema = Joi.object({
    text: Joi.string().required().min(5).max(400),
    isEveryOneCanReply: Joi.boolean(),
  });

  return schema.validate(post);
}

exports.validatePost = validatePost;
exports.Post = mongoose.model("Post", schema);
