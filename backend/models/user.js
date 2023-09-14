const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const schema = new mongoose.Schema(
  {
    image: String,
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      minlength: 5,
      maxlength: 150,
    },
    post_ids: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Post",
    },
    saved_post_ids: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Post",
    },
    following: {
      user_ids: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: "User",
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    followers: {
      user_ids: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: "User",
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

schema.methods.generateAuthToken = function () {
  const user = {
    _id: this._id,
    name: this.name,
    image: this.image,
    isAdmin: this.isAdmin,
  };

  return jwt.sign(user, process.env.JWK);
};

const shortUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

function validateSignup(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(50),
  });

  return schema.validate(user);
}

function validateSignin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(50),
  });

  return schema.validate(user);
}

function validateUpdateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    image: Joi.string(),
    bio: Joi.string().min(5).max(150),
  });

  return schema.validate(user);
}

exports.validateUpdateUser = validateUpdateUser;
exports.validateSignup = validateSignup;
exports.validateSignin = validateSignin;
exports.shortUserSchema = shortUserSchema;
exports.User = mongoose.model("User", schema);
