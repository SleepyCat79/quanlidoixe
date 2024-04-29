const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Maintaince = mongoose.model("Maintaince");

router.post("/newmaintain", async (req, res) => {
  const { type, name, date, vehicle, vehiclename, cost } = req.body;
  const ismaintain = await Maintaince.findOne({ vehicle });
  if (ismaintain) {
    return res
      .status(422)
      .json({ error: "Maintaince already exists with that vehicle" });
  }
  try {
    const maintaince = new Maintaince({
      type,
      name,
      date,
      vehicle,
      vehiclename,
      cost,
    });
    await maintaince.save();
    res.json({ status: "success" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.get("/getmaintain", async (req, res) => {
  const maintaince = await Maintaince.find();
  res.json(maintaince);
});

module.exports = router;
