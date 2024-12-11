const mongoose = require("mongoose");
const User = require("./BaseModel");

const ParentModel = new mongoose.Schema({
  children: [
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      bloodGroup: {
        type: String,
        required: true,
      },
    },
  ],
  vaccination_history: [
    {
      vaccination_date: {
        type: Date,
      },
      vaccined_child: {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          required: true,
        },
        bloodGroup: {
          type: String,
          required: true,
        },
      },
    },
  ],
});

module.exports = User.discriminator("parent", ParentModel);
