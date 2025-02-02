const { folder: folderModel } = require("../models");

const doesFolderExistWithGivenName = async (name) => {
  const folder = await folderModel.findOne({
    where: { name },
  });
  if (folder) return true;
  else return false;
};

const isValidFolderType = (type) => ["csv", "img", "pdf", "ppt"].includes(type);

const isValidMaxFileLimit = (maxFileLimit) =>
  Number.isInteger(maxFileLimit) && maxFileLimit > 0;

const validateFolderAttributes = async (folder) => {
  const errors = [];
  const { name, type, maxFileLimit } = folder;
  if (!name) {
    errors.push("name is required");
  } else {
    const existingFolderWithTheName = await doesFolderExistWithGivenName(name);
    if (existingFolderWithTheName) {
      errors.push("Folder with the given name already exists");
    }
  }
  if (!type) {
    errors.push("type is required");
  } else if (!isValidFolderType(type)) {
    errors.push("type must be one of ['csv', 'img', 'pdf', 'ppt']");
  }

  if (!maxFileLimit) {
    errors.push("maxFileLimit is required");
  } else if (!isValidMaxFileLimit(maxFileLimit)) {
    errors.push("maxFileLimit must be a positive integer");
  }
  return errors;
};

const validateUpdateFolderAttributes = async (body) => {
  const { name, type, maxFileLimit } = body;
  const errors = [];
  if (type && !isValidFolderType(type)) {
    errors.push("type must be one of ['csv', 'img', 'pdf', 'ppt']");
  }
  if (maxFileLimit && !isValidMaxFileLimit(maxFileLimit)) {
    errors.push("maxFileLimit must be a positive integer");
  }
  return errors;
};

module.exports = {
  validateFolderAttributes,
  validateUpdateFolderAttributes,
};
