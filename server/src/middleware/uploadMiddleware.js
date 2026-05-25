const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "social_media_posts",

    resource_type: "auto",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

const upload = multer({
  storage,
});

module.exports = upload;
