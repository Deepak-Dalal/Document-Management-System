const path = require("path");
const fs = require("fs");
const { fileTypeValidator } = require("../validators/fileValidators");
const multer = require("multer");
const { UNEXPECTED_FILE_TYPE } = require("../constants/file");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const saveToFolder = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isFileTypeAllowed = fileTypeValidator(file);
    if (isFileTypeAllowed) {
      return cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          UNEXPECTED_FILE_TYPE.code,
          UNEXPECTED_FILE_TYPE.message
        ),
        false
      );
    }
  },
}).array("File", 1);

module.exports = saveToFolder;
