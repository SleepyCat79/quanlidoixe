const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  option: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  imageFileId: {
    type: [String],
    required: false, // This field is not required, it can be null if there's no image
  },
  lastmaintenance: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
