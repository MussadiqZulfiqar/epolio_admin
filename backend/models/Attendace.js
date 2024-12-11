const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    isPresent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "worker",
      },
    ],
    isAbsent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "worker",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
