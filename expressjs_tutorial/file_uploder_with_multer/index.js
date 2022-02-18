const express = require("express");
const path = require("path");
const multer = require("multer");

// File upload folder
const UPLOADS_FOLDER = "./uploads/";

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    //  Imp File.pdf => imp-file-14141414.pdf
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname.replace(fileExt, "").split(" ").join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

// prepare the final multer upload object

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg .png or .jpeg format allowed!!!"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf format allowed!!!"));
      }
    }
  },
});

const app = express();

// application route
app.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 2 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send("Hello World");
  }
);

// error handling Middleware
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError)
      res.status(500).send("There was an upload error!!!");
    else res.status(500).send(err.message);
  } else {
    res.send("Success");
  }
});

app.listen(3030, () => {
  console.log("Server app is listening at port 3030");
});
