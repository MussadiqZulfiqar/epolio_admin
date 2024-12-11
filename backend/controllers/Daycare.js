const express = require("express");
const router = express.Router();
const DayCare = require("./../models/Daycare");

const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const fs = require("fs");
//uploading new daycare
router.post(
  "/add-daycare",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      // Check if user has the required role
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("You are not allowed to post!!", 403)); // 403 Forbidden
      }

      // Check if daycare with the same location and date already exists
      const alreadyAdded = await DayCare.findOne({
        date: new Date(req.body.date), // Make sure the date is in the correct format
        location: req.body.location,
      });

      if (alreadyAdded) {
        return next(
          new ErrorHandler(
            "Daycare for the same location and date is already added!",
            400 // Use 400 for client errors
          )
        );
      }

      // Create new daycare entry
      const newDayCare = await DayCare.create(req.body);

      // Send success response
      res.status(200).json({
        success: true,
        newDaycare: newDayCare,
        message: "Daycare added successfully!",
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500)); // 500 for server errors
    }
  })
);

//fetching daycare
router.get(
  "/get-all-daycares",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("You are not Admin!!", 500));
      }
      const alldaycares = await DayCare.find().sort({ createdAt: -1 });
      res.json({
        daycares: alldaycares,
      });
    } catch (e) {}
  })
);
//deleting daycare
router.delete(
  "/delete-daycare",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    try {
      if (req.user.role === "admin") {
        const deletedPharmacist = await DayCare.findByIdAndDelete(id);
        res.status(200).json({ message: "Daycare deleted successfully!!" });
      } else {
        next(new ErrorHandler("You are not Admin", 500));
      }
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
