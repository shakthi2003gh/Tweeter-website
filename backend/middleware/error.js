const dbugError = require("debug")("error:");

exports.error = function (err, req, res, next) {
  res.status(500).send({ error: err });
  dbugError(err);
};
