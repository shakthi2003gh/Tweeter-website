const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.auth = async function (req, res, next) {
  const token = req.header("x-tweeter-auth");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    req.user = jwt.verify(token, process.env.JWK);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).send("Access denied. Invalid token");

    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token.", error });
  }
};
