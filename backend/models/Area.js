const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    supervisorName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Areas", AreaSchema);
