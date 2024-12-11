const mongoose = require("mongoose");

const daycareSchema = new mongoose.Schema(
  {
    daycareName: {
      type: String,
      required: [true, "Please provide daycare name"],
    },
    date: {
      type: Date,
      required: [true, "Please provide daycare name"],
    },
    location: {
      type: String,
      required: [true, "Please provide daycare location"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a contact phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide a contact email"],
    },
    operatingHours: {
      type: String,
      required: [true, "Please provide operating hours"],
    },
    services: {
      type: [String], // Array of strings for services provided
      required: true,
    },
    supervisorName: {
      type: String,
      required: [true, "Please provide the supervisor's name"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DayCare", daycareSchema);
