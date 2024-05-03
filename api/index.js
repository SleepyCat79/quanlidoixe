const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongourl = require("./secrets").mongourl;
const app = express();
const port = 8000;
require("./models/Users");
require("./models/Drivers");
require("./models/Vehicle");
require("./models/Maintaince");
require("./models/schedule");

const cors = require("cors");
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/driver");
const uploadRoutes = require("./routes/upload");
const vehicleRoutes = require("./routes/vehicle");
const maintainceRoutes = require("./routes/maintain");
const scheduleRoutes = require("./routes/schedule");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(driverRoutes);
app.use(vehicleRoutes);
app.use(maintainceRoutes);
app.use(scheduleRoutes);
uploadRoutes(app); // Call the function with app as an argument

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});
