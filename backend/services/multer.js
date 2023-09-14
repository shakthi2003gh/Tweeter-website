const multer = require("multer");

const storage = multer.memoryStorage();

exports.uploadPost = multer({ storage }).single("image");
exports.uploadProfile = multer({ storage }).single("profile");
