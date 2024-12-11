const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    vaccinated: {
      type: Boolean,
      required: true,
    },
    date: {
      type: [Date],
      required: true,
    },
    numberOfChildren: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
