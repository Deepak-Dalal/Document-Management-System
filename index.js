const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const folderRouter = require("./router/folderRouter");
const { sequelize } = require("./models");
const fileRouter = require("./router/fileRouter");

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected.");
  })
  .catch((error) => {
    console.error("Unable to connect to database", error);
  });

app.use("/folders", folderRouter);
app.use("/files", fileRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the document management system");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server listening on port " + port);
});
