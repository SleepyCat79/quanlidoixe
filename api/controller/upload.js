const upload = require("../middleware/upload");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url =
  "mongodb+srv://huyvonguyengia:PSIpz8HeoTDbmY4O@tasktracking.gjiiy01.mongodb.net/";

const baseUrl = "http://localhost:8000/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    // Return the filename in the response
    return res.send({
      message: "File has been uploaded.",
      filename: req.file.filename, // Add this line
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db("test");
    const images = database.collection("images.files");
    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db("test");
    const bucket = new GridFSBucket(database, {
      bucketName: "images",
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
};
