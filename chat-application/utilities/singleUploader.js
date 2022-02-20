function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) {
  // external imports
  const multer = require("multer");
  const path = require("path");
  const createError = require("http-errors");

  // file path
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}`;

  // defining the storage path
  const storage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      //  Imp File.pdf => imp-file-14141414.pdf
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname.replace(fileExt, "").split(" ").join("-") +
        "-" +
        Date.now();

      cb(null, filename + fileExt);
    },
  });

  // prepare the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
