const mongoose = require("mongoose");

const MaintainSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

mongoose.model("Maintaince", MaintainSchema);
