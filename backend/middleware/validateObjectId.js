const { isValidObjectId } = require("mongoose");

exports.validateObjectId = function (req, res, next) {
  if (!isValidObjectId(req.params.id))
    return res.status(400).send("Invalid id.");

  next();
};
