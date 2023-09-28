const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const studentRoutes = require("./apis/routes/student");
const otpRoutes = require("./apis/routes/otp");
const subjectRoutes = require("./apis/routes/subject");
const cronPush = require("./apis/cronPushNotification");
const pushNotificationRoute = require("./apis/routes/push_notification");
const pdfRoutes = require("./apis/routes/pdf_generation");
const excelRoutes = require("./apis/routes/excel");
const zipRoutes = require("./apis/routes/zip");

require("dotenv").config();
require("./apis/config/db");

mongoose.Promise = global.Promise;
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//CORS -handle cross-origin requests.It allows any origin (*) and specifies which are allowed (PUT, POST, PATCH, DELETE).
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

//API Routes------
app.use("/api/student", studentRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/push-notification", pushNotificationRoute);
app.use("/api/pdf", pdfRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/zip", zipRoutes);

app.use("/cancel", (req, res) => {
  console.log("cancel");
  console.log(req);
});

app.use("/success", (req, res) => {
  console.log("success");
  console.log(req);
});

//If none of the previous routes match the requested path,
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
