const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Schedule = mongoose.model("Schedule");

router.post("/schedule", async (req, res) => {
  const { driver, doanhthu, start, end, distance, time, date } = req.body;
  try {
    const schedule = new Schedule({
      driver,
      doanhthu,
      start,
      end,
      distance,
      time,
      loinhuan: doanhthu - distance * 0.85,
      date,
    });
    await schedule.save();
    res.json({ status: "success" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const schedule = await Schedule.find();
    res.json(schedule);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
router.get("/schedule/:driver", async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ driver: req.params.driver });
    res.json(schedule);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
module.exports = router;
