const { S3 } = require("aws-sdk");

const s3 = new S3();

exports.s3UploadProfile = (req, res, next) => {
  if (!req.file) return next();

  const filename = "profile-" + Date.now() + ".jpg";
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/profile/${filename}`,
    Body: req.file.buffer,
  };

  s3.upload(param)
    .promise()
    .then((result) => {
      req.body.image = result.Location;

      next();
    })
    .catch((e) => {
      console.error(e);
    });
};

exports.s3UploadPost = (req, res, next) => {
  if (!req.file) return next();

  const filename = "post-" + Date.now() + ".jpg";
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/posts/${filename}`,
    Body: req.file.buffer,
  };

  s3.upload(param)
    .promise()
    .then((result) => {
      req.body.image = result.Location;

      next();
    })
    .catch((e) => {
      console.error(e);
    });
};
