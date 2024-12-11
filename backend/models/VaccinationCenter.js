const mongoose = require("mongoose");

const vaccinationCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    availableVaccines: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VaccinationCenter = mongoose.model(
  "VaccinationCenter",
  vaccinationCenterSchema
);

module.exports = VaccinationCenter;
