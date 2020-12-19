//Install express server
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();
app.use(
  fileUpload({
    createParentPath: true
  })
);
app.use(express.static("images"));

// Serve only the static files form the dist directory
app.use(express.static("./dist"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

// Start the app by listening on the default Heroku port

app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let file = req.files.file;
      file.mv("./static/images/" + file.name);
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

app.listen(process.env.PORT || 8080);
module.exports = app;
