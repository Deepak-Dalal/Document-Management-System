const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/fileController");

fileRouter.get("/", fileController.getFilesAcrossFoldersByType);

module.exports = fileRouter;
