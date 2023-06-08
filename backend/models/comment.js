const mongoose = require("mongoose");
const Joi = require("joi");

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
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

function validateComment(comment) {
  const schema = Joi.object({
    message: Joi.string().required().min(5).max(200),
  });

  return schema.validate(comment);
}

exports.validateComment = validateComment;
exports.Comment = mongoose.model("Comment", schema);
