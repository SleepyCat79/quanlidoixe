const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Driver = mongoose.model("Driver");

router.post("/AddDriver", async (req, res) => {
  const {
    name,
    age,
    experience,
    address,
    phoneNumber,
    license,
    startDate,
    endDate,
  } = req.body;

  // Check if all required properties exist
  if (
    !name ||
    !age ||
    !experience ||
    !address ||
    !phoneNumber ||
    !license ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const existingDriver = await Driver.findOne({
    phoneNumber,
  });
  if (existingDriver) {
    return res.status(422).json({
      error: "Driver already exists with that phone number",
    });
  }
  try {
    const driver = new Driver({
      name,
      age,
      experience,
      address,
      phoneNumber,
      license,
      startDate,
      endDate,
    });
    await driver.save();
    res.json({
      status: "success",
    });
  } catch (err) {
    return res.status(422).json({
      error: err.message,
    });
  }
});

router.get("/GetDrivers", async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

router.get("/GetDriver/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({
        error: "Driver not found",
      });
    }
    res.json(driver);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});
router.delete("/DeleteDriver/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.deleteOne({ _id: id });
    if (!driver) {
      return res.status(404).json({
        error: "Driver not found",
      });
    }
    res.json({
      status: "success",
      message: "Driver deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
