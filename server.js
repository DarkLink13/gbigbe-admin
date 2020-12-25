//Install express server
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const Minio = require("minio");
var Fs = require("fs");

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

const minioClient = new Minio.Client({
  endPoint: "storage.konbex.com",
  port: 9999,
  useSSL: false,
  accessKey: "konbex_access_key",
  secretKey: "9a423f04e48e9f0d39623ee43d0b82eeb248a7a15ebd7b8bcb29a6b6a7d22b0c"
});
app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let file = req.files.file;
      file.mv("./dist/" + file.name);
      minioClient.traceOn(process.stdout);
      var fileStream = Fs.createReadStream("./dist/" + file.name);
      var fileStat = Fs.stat("./dist/" + file.name, function (err, stats) {
        if (err) {
          return err;
        }
        minioClient.putObject(
          "gbigbe",
          "public/" + file.name,
          fileStream,
          stats.size,
          function (err, etag) {
            if (err) res.status(500).send(err);
          }
        );
      });
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
