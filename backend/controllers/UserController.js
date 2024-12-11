const express = require("express");
const router = express.Router();
const User = require("./../models/BaseModel");
const Worker = require("./../models/WorkerModel");
const Parent = require("./../models/ParentModel");
const Appointments = require("./../models/Appointment");
const Record = require("./../models/DataEntry");
const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const SendToken = require("./../utils/SendToken");
const fs = require("fs");
const sendMailToWOrker = require("./../utils/WorkerMail");

// Signup Route
router.post(
  "/signup",
  CatchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      } else {
        let newUser;

        newUser = await User.create({
          name: "Faizan Ali",
          email,
          cnic: 1610170358531,
          password,
        });

        SendToken(res, 200, newUser);
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
// Login Route
router.post(
  "/login-user",
  CatchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Invalid email or password!!", 400));
      }
      const user = await User.findOne({ email: email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      const isPasswordValid = await user.comparePasswords(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Password is not valid!!", 400));
      }
      SendToken(res, 200, user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/getuser",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//geting parent data
router.get(
  "/getuser-single/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Admin add Worker
router.post(
  "/admin-add-worker",
  CatchAsyncError(async (req, res, next) => {
    try {
      const { name, email, cnic, gender, contact, age } = req.body;
      const alreadyAdded = await User.findOne({ email: email });
      if (alreadyAdded) {
        return next(new ErrorHandler("Person is Already added!!", 500));
      } else {
        let lastFiveDigits =
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-5);
        const newWorker = await Worker.create({
          name,
          email,
          cnic,
          gender,
          contact,
          age,

          password: lastFiveDigits,
        });
        await sendMailToWOrker({
          email: email,
          name: name,
          type: "Worker",
          lastFiveDigits: lastFiveDigits,
          subject: "Successfully registered as Worker!!",
        });

        res.status(200).json({
          newWorker,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//admin getting all workers
router.get(
  "/admin-all-workers",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 20;
      const myWorkers = await Worker.find().skip(startIndex).limit(limit);
      res.json({
        success: true,
        workers: myWorkers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.toString(), 500));
    }
  })
);
//getting only the names of worker
router.get(
  "/get-attendance-names",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const workers = await Worker.find({}, "name"); // Fetch only name,attendance and _id
      res.json(workers);
    } catch (error) {
      return next(new ErrorHandler("Error fetching workers", 500));
    }
  })
);

//delete Worker
router.delete(
  "/delet-worker",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    try {
      if (req.user.role === "admin") {
        await Promise.all([
          await Worker.findByIdAndDelete(id),
          await Appointments.deleteMany({ provided_by: id }),
        ]);
        res.status(200).json({ message: "Worker deleted successfully!!" });
      } else {
        next(new ErrorHandler("You are not Admin", 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//admin getting all workers
router.get(
  "/admin-all-parents",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 20;
      const myWorkers = await Parent.find().skip(startIndex).limit(limit);
      res.json({
        success: true,
        parents: myWorkers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.toString(), 500));
    }
  })
);
router.get(
  "/admin-all-records",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      // Get pagination parameters from the query string
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 20;

      // Fetch records with pagination
      const records = await Record.find().skip(startIndex).limit(limit);

      // Respond with paginated data
      res.json({
        success: true,
        records,
      });
    } catch (error) {
      return next(new ErrorHandler(error.toString(), 500));
    }
  })
);
//delete Worker
router.delete(
  "/delet-parent",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    try {
      if (req.user.role === "admin") {
        const deletedPharmacist = await Parent.findByIdAndDelete(id);
        res.status(200).json({ message: "parent deleted successfully!!" });
      } else {
        next(new ErrorHandler("You are not Admin", 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
