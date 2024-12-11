const express = require("express");
const router = express.Router();
const Attendace = require("./../models/Attendace");
const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const { format } = require("date-fns");
router.post(
  "/mark",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const { isPresent, isAbsent, date } = req.body; // Extract date from request body

      // Convert the provided date to a Date object and ensure it's only the date part (without time)
      const providedDate = new Date(date);
      const startOfDay = new Date(providedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(providedDate.setHours(23, 59, 59, 999));
      console.log(format(new Date(date), "PPp"));
      // Check if attendance for the provided date is already marked
      const alreadyAdded = await Attendace.findOne({
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (alreadyAdded) {
        return next(
          new ErrorHandler(
            "Attendance for the selected date is already marked!",
            500
          )
        );
      }

      // Create the new attendance record
      const created = await Attendace.create({
        date: providedDate, // Use the provided date
        isPresent: isPresent,
        isAbsent: isAbsent,
      });

      res.status(200).json({ created });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

router.get(
  "/get-all",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const today = new Date();

      // Start of the current month
      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1, //1st day of the current month
        0, //0 hour 0 min 0 seco and 0 microsec
        0,
        0,
        0
      );

      // End of the current month using setMonth() method
      const endOfMonth = new Date(today);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0); // Sets the day to the 0 of next month means last of current month
      endOfMonth.setHours(23, 59, 59, 999); // Set the time to the last moment of the day
      console.log(format(new Date(startOfMonth), "PPPp"));
      console.log(format(new Date(endOfMonth), "PPp"));
      // Fetch attendance records for this month
      const created = await Attendace.find({
        date: {
          $gte: startOfMonth, // Start of the month
          $lt: endOfMonth, // End of the month
        },
      }).sort({ createdAt: -1 });

      res.status(200).json({ created: created });
    } catch (err) {
      return next(new ErrorHandler(err, 500));
    }
  })
);

router.get(
  "/get/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const getData = await Attendace.findById(req.params.id);
      if (!getData) {
        return next(new ErrorHandler("No Attendance found!!", 500));
      }
      res.status(200).json({
        isPresent: getData.isPresent,
        date: getData.date,
        isAbsent: getData.isAbsent,
      });
    } catch (e) {}
  })
);
//updating
router.put(
  "/update/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const getData = await Attendace.findByIdAndUpdate(req.params.id, {
        date: new Date(req.body.date),
        isAbsent: req.body.isAbsent,
        isPresent: req.body.isPresent,
      });
      if (!getData) {
        return next(new ErrorHandler("No Attendance found!!", 500));
      }
      res.status(200).json({
        sucess: true,
      });
    } catch (e) {}
  })
);
module.exports = router;
