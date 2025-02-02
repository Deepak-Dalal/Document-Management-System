const express = require("express");
const folderRouter = express.Router();
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const { UNEXPECTED_FILE_TYPE } = require("../constants/file");
const saveToFolder = require("../middleware/fileUpload");
const multer = require("multer");

folderRouter.post("/create", folderController.createFolder);
folderRouter.patch("/:folderId", folderController.updateFolder);
folderRouter.delete("/:folderId", folderController.deleteFolder);
folderRouter.get("/", folderController.getAllFolders);

folderRouter.post(
  "/:folderId/files",
  (req, res, next) => {
    saveToFolder(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === UNEXPECTED_FILE_TYPE.code) {
            return res.status(400).json({ error: { description: err.field } });
          }
        } else {
          return res.status(500).json({ error: { description: err.message } });
        }
      }
      next();
    });
  },
  fileController.uploadFile
);

folderRouter.patch(
  "/:folderId/files/:fileId",
  fileController.updateFileDescription
);

folderRouter.delete("/:folderId/files/:fileId", fileController.deleteFile);
folderRouter.get("/:folderId/files", fileController.getAllFilesInTheFolder);
folderRouter.get(
  "/:folderId/filesBySort",
  fileController.getAllFilesInTheFolderSorted
);
folderRouter.get("/:folderId/files/metadata", fileController.getFileMetadata);

module.exports = folderRouter;
