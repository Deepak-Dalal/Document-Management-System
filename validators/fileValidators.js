const path = require("path");

const fileTypeValidator = (file) => {
  const fileTypes = /jpeg|jpg|png|gif|csv|pdf/;
  const validExtname = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const validMimeType = fileTypes.test(file.mimetype);
  return validExtname && validMimeType;
};

module.exports = { fileTypeValidator };
