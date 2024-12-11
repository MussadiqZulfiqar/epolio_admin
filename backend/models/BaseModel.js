const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const options = {
  discriminatorKey: "role",
  collection: "Users",
};
const BaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    contact: {
      type: Number,
      default: "",
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    addresses: [
      {
        country: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
    },
  },
  { timestamps: true, ...options }
);

BaseSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
//getting jwt token
BaseSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES,
  });
};
//comparing passwords
BaseSchema.methods.comparePasswords = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};
module.exports = mongoose.model["Users"] || mongoose.model("Users", BaseSchema);
