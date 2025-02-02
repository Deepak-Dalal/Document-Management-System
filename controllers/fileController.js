const { ONE_MB_IN_BYTES } = require("../constants/file");
const { folder: folderModel, file: fileModel } = require("../models");
const fs = require("fs");

const uploadFile = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        error: { description: "File not present in the request." },
      });
    }
    if (Array.isArray(req.files) && req.files.length === 0) {
      return res.status(400).json({
        error: {
          description: "No file uploaded",
        },
      });
    }
    const folderId = req.params.folderId;
    const { description } = req.body;
    const file = req.files[0];

    const folder = await folderModel.findOne({
      where: { folderId },
      attributes: ["type", "maxFileLimit"],
      raw: true,
    });

    if (!folder) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    } else if (folder.type !== file.mimetype.slice(-3)) {
      return res
        .status(400)
        .json({ error: "The folder type doesn't match with the file type" });
    }

    if (file.size > ONE_MB_IN_BYTES * 10) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return res.status(400).json({ error: "File size exceeds 10 MB" });
    }

    const sumOfFileSizesInFolder = await fileModel.sum("size", {
      where: { folderId },
    });

    if (sumOfFileSizesInFolder > folder.maxFileLimit * 1024 * 1024) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return res.status(400).json({
        error: "Folder will exceed maxFileLimit on uploading this file",
      });
    }
    const newfileInDb = await fileModel.create({
      folderId,
      name: file.originalname,
      description,
      type: file.mimetype,
      size: file.size,
    });

    res
      .status(200)
      .json({ message: "File uploaded successfully", file: newfileInDb });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFileDescription = async (req, res) => {
  try {
    const { folderId, fileId } = req.params;
    const description = req.body.description;

    const folder = await folderModel.findOne({
      where: { folderId },
      raw: true,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    }

    const file = await fileModel.findOne({
      where: { fileId },
    });

    if (!file) {
      return res
        .status(404)
        .json({ error: "File with given fileId doesn't exist" });
    }

    if (file.folderId != folderId) {
      return res
        .status(400)
        .json({ error: "File doesn't exist in the specified folder" });
    }

    Object.assign(file, { description });
    await file.save();

    res.status(200).json({
      message: "File description updated successfully",
      file: {
        fileId: file.fileId,
        description,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { folderId, fileId } = req.params;

    const folder = await folderModel.findOne({
      where: { folderId },
      raw: true,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    }

    const file = await fileModel.findOne({
      where: { fileId },
    });

    if (!file) {
      return res
        .status(404)
        .json({ error: "File with given fileId doesn't exist" });
    }

    if (file.folderId != folderId) {
      return res
        .status(400)
        .json({ error: "File doesn't exist in the specified folder" });
    }

    await file.destroy();

    res.status(204).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFilesInTheFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await folderModel.findOne({
      where: { folderId },
      raw: true,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    }
    const files = await fileModel.findAll({ where: { folderId } });
    if (files.length == 0) {
      return res
        .status(404)
        .json({ error: "No files found in the given folder" });
    }
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFilesInTheFolderSorted = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await folderModel.findOne({
      where: { folderId },
      raw: true,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    }
    const sortBy = req.query.sort;
    const files = await fileModel.findAll({
      where: { folderId },
      order: [[sortBy, "ASC"]],
    });
    if (files.length == 0) {
      return res
        .status(404)
        .json({ error: "No files found in the given folder" });
    }
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilesAcrossFoldersByType = async (req, res) => {
  try {
    const type = req.query.type;
    const files = await fileModel.findAll({
      where: { type },
    });
    if (files.length == 0) {
      return res.status(404).json({ error: "No files found" });
    }
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFileMetadata = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await folderModel.findOne({
      where: { folderId },
      raw: true,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder with given folderId doesn't exist" });
    }
    const files = await fileModel.findAll({
      where: { folderId },
    });
    if (files.length == 0) {
      return res.status(404).json({ error: "No files found" });
    }
    const filesWithMetadata = files.map((file) => {
      const { fileId, name, size, description } = file;
      return { fileId, name, size, description };
    });
    res.status(200).json({ files: filesWithMetadata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  updateFileDescription,
  deleteFile,
  getAllFilesInTheFolder,
  getAllFilesInTheFolderSorted,
  getFilesAcrossFoldersByType,
  getFileMetadata,
};
