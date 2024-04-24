const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  license: {
    type: [String],
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  imageFileId: {
    type: String,
    required: false, // This field is not required, it can be null if there's no image
  },
});

module.exports = mongoose.model("Driver", driverSchema);
