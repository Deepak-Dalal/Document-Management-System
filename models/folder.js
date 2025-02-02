module.exports = (sequelize, DataTypes) => {
  const folder = sequelize.define(
    "folder",
    {
      folderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM("csv", "img", "pdf", "ppt"),
        allowNull: false,
      },
      maxFileLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "folders",
      timestamps: false,
    }
  );
  return folder;
};
