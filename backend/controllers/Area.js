const express = require("express");
const router = express.Router();
const Area = require("./../models/Area");

const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const fs = require("fs");
//uploading new Area
router.post(
  "/add-Area",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      // Check if user has the required role
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("You are not allowed to post!!", 403)); // 403 Forbidden
      }

      // Normalize city and town names to lowercase for comparison
      const city = req.body.city.toLowerCase();
      const town = req.body.town.toLowerCase();

      // Check if Area with the same city and town already exists
      const alreadyAdded = await Area.findOne({
        city: city,
        town: town,
      });

      if (alreadyAdded) {
        // Calculate the date 2 months ago
        const todayDate = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(todayDate.getMonth() - 2);

        const areaDate = new Date(alreadyAdded.date);

        // Check if the area was listed in the last two months
        if (areaDate >= twoMonthsAgo) {
          return next(new ErrorHandler("The Area is already listed!!", 403));
        }

        // Update the existing area entry with the new date
        const updatedArea = await Area.findByIdAndUpdate(
          alreadyAdded._id,
          {
            $set: {
              date: req.body.date,
            },
          },
          {
            new: true, // Return the updated document
          }
        );

        // Send success response for the update
        return res.status(200).json({
          success: true,
          newArea: updatedArea,
          message: "Area updated successfully!",
        });
      }

      // If no existing area, create a new Area entry with normalized city and town names
      const newArea = await Area.create({
        ...req.body,
        city: city, // Save as lowercase
        town: town, // Save as lowercase
      });

      // Send success response for new entry
      return res.status(200).json({
        success: true,
        newArea: newArea,
        message: "Area added successfully!",
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500)); // 500 for server errors
    }
  })
);

//fetching Area
router.get(
  "/get-all-Areas",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new ErrorHandler("You are not Admin!!", 500));
      }
      const allAreas = await Area.find().sort({ createdAt: -1 });
      res.json({
        Areas: allAreas,
      });
    } catch (e) {}
  })
);
//deleting Area
router.delete(
  "/delete-Area",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    try {
      if (req.user.role === "admin") {
        const deletedPharmacist = await Area.findByIdAndDelete(id);
        res.status(200).json({ message: "Area deleted successfully!!" });
      } else {
        next(new ErrorHandler("You are not Admin", 500));
      }
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
