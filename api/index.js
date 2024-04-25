const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongourl = require("./secrets").mongourl;
const app = express();
const port = 8000;
require("./models/Users");
require("./models/Drivers");
require("./models/Vehicle");

const cors = require("cors");
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/driver");
const uploadRoutes = require("./routes/upload");
const vehicleRoutes = require("./routes/vehicle");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(driverRoutes);
app.use(vehicleRoutes);
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
