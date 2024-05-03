const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  driver: {
    type: String,
    required: true,
  },
  doanhthu: {
    type: Number,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  loinhuan: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

mongoose.model("Schedule", ScheduleSchema);
