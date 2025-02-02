const { folder: folderModel } = require("../models");
const {
  validateFolderAttributes,
  validateUpdateFolderAttributes,
} = require("../validators/folderValidators");

const createFolder = async (req, res) => {
  try {
    const errors = await validateFolderAttributes(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const newFolder = await folderModel.create(req.body);
    res
      .status(200)
      .json({ message: "Folder created successfully", folder: newFolder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFolder = async (req, res) => {
  try {
    const { name, type, maxFileLimit } = req.body;
    const folderId = req.params.folderId;

    const errors = await validateUpdateFolderAttributes(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const folder = await folderModel.findOne({
      where: { folderId },
    });

    if (!folder) {
      return res.status(400).json({
        error: "Invalid folderId. Folder with the given id doesn't exist",
      });
    }

    const updateAttributes = {};
    if (name) updateAttributes.name = name;
    if (type) updateAttributes.type = type;
    if (maxFileLimit) updateAttributes.maxFileLimit = maxFileLimit;

    Object.assign(folder, updateAttributes);

    await folder.save();

    res.status(200).json({ message: "Folder updated successfully", folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;

    const folder = await folderModel.findOne({
      where: { folderId },
    });

    if (!folder) {
      return res.status(400).json({
        error: "Invalid folderId. Folder with the given id doesn't exist",
      });
    }

    await folderModel.destroy({ where: { folderId } });

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFolders = async (req, res) => {
  try {
    const folders = await folderModel.findAll();
    if (folders.length == 0) {
      return res.status(400).json({ error: "No folder found" });
    }
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFolder, updateFolder, deleteFolder, getAllFolders };
