const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Vehicle = mongoose.model("Vehicle");

router.post("/AddVehicle", async (req, res) => {
  const { name, option, driver, weight, size, fuelType, status, imageFileId } =
    req.body;

  // Check if all required properties exist
  if (
    !name ||
    !option ||
    !driver ||
    !weight ||
    !size ||
    !fuelType ||
    !status ||
    !imageFileId
  ) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const existingVehicle = await Vehicle.findOne({
    driver: driver,
  });

  if (existingVehicle) {
    // There is already a vehicle with this driver ID
    return res.status(400).json({
      error: "A vehicle with this driver ID already exists",
    });
  }
  try {
    const vehicle = new Vehicle({
      name,
      option,
      driver,
      weight,
      size,
      fuelType,
      status,
      imageFileId,
      lastmaintenance: "Chưa bảo trì",
    });
    await vehicle.save();
    res.json({
      status: "success",
    });
  } catch (err) {
    return res.status(422).json({
      error: err.message,
    });
  }
});

router.get("/GetVehicle", async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
});
router.delete("/DeleteVehicle/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findByIdAndRemove(id);
    if (!vehicle) {
      return res.status(404).json({
        error: "Vehicle not found",
      });
    }
    res.json({
      status: "success",
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});
module.exports = router;
