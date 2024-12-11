const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const errorHan = require("./middlewares/error");
const express = require("express");
const app = express();
//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use("/", express.static("uploads"));
//routes
const userRoutes = require("./controllers/UserController");
const daycare = require("./controllers/Daycare");
const area = require("./controllers/Area");
const vac = require("./controllers/VaccinationCenter");
const appointment = require("./controllers/Appointment");
const attendance = require("./controllers/AttendaceController");

app.use("/api/v2/user", userRoutes);
app.use("/api/v2/daycare", daycare);
app.use("/api/v2/area", area);
app.use("/api/v2/vaccination", vac);
app.use("/api/v2/appointment", appointment);
app.use("/api/v2/attendance", attendance);

//handleing errors
app.use(errorHan);
module.exports = app;
