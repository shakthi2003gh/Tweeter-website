const mongoose = require("mongoose");
const Joi = require("joi");
const { shortUserSchema } = require("./user");
const { commentSchema } = require("./comment");

const schema = new mongoose.Schema(
  {
    user: {
      type: shortUserSchema,
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
      type: [commentSchema],
      default: [],
    },
    likes: {
      user_ids: {
        type: [mongoose.Types.ObjectId],
        default: [],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    saved: {
      user_ids: {
        type: [mongoose.Types.ObjectId],
        default: [],
      },
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
