const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(
  fileUpload({
    createParentPath: true
  })
);

app.post("/upload", async (req: any, res: any) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let file = req.files.file;
      file.mv("./static/" + file.name);
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = app;
