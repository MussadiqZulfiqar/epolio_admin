const mongoose = require("mongoose");
const User = require("./BaseModel");
const WorkerModel = new mongoose.Schema({
  experience: {
    type: String,
  },
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      isPresent: {
        type: Boolean,
        required: true,
      },
    },
  ],
});
module.exports = User.discriminator("worker", WorkerModel);
