const multer = require("multer");

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts/");
  },
  filename: function (req, file, cb) {
    const fileName = "post" + "-" + Date.now();
    cb(null, fileName + ".jpg");
  },
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile/");
  },
  filename: function (req, file, cb) {
    const fileName = req.user.name + "-" + Date.now();
    cb(null, fileName + ".jpg");
  },
});

exports.uploadPost = multer({ storage: postStorage }).single("image");
exports.uploadProfile = multer({ storage: profileStorage }).single("profile");
