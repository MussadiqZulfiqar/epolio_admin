const mongoose = require("mongoose");

const Appointment = new mongoose.Schema(
  {
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parent",
      required: true,
    },
    provided_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "worker",
    },
    requested_date: {
      type: Date,
      required: true,
    },
    read_admin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    type: {
      type: String,
    },
    compaign: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointments", Appointment);
