const express = require("express");
const router = express.Router();

const VaccinationCenter = require("./../models/VaccinationCenter");

const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const fs = require("fs");

router.post(
  "/add-center",
  isAuthenticated,
  CatchAsyncError(async (req, res) => {
    const { name, address, contactNumber, openingHours, availableVaccines } =
      req.body;

    try {
      const newCenter = new VaccinationCenter({
        name,
        address,
        contactNumber,
        openingHours,
        availableVaccines,
      });

      const savedCenter = await newCenter.save();
      res.status(201).json(savedCenter);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);
//admin getting all workers
router.get(
  "/admin-all-centers",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const myCenters = await VaccinationCenter.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        Centers: myCenters,
      });
    } catch (error) {
      return next(new ErrorHandler(error.toString(), 500));
    }
  })
);

//delete Worker
router.delete(
  "/delet-center",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    try {
      if (req.user.role === "admin") {
        const deletedPharmacist = await VaccinationCenter.findByIdAndDelete(id);
        res.status(200).json({ message: "Center deleted successfully!!" });
      } else {
        next(new ErrorHandler("You are not Admin", 500));
      }
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
