const express = require("express");
const router = express.Router();
const Appointment = require("./../models/Appointment");
const Workers = require("./../models/WorkerModel");
const Parents = require("./../models/ParentModel");
const Center = require("./../models/VaccinationCenter");
const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middlewares/isAuthenticated");
const CatchAsyncError = require("./../utils/CatchAsyncError");
const fs = require("fs");
const AdminTellUser = require("./../utils/AdminTellUser");
const AdminTellworker = require("./../utils/AdminTellWorker");

//This query will return only the _id and createdAt field for each document.
router.get(
  "/get-for-dashboard",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const appointmentStatus = await Appointment.find({}, "status");
      const appointmentDates = await Appointment.find({}, "requested_date");
      const LatestfiveAppointments = await Appointment.find()
        .limit(5)
        .sort({ createdAt: -1 })
        .populate("requested_by")
        .populate("provided_by");
      const workerNumber = await Workers.countDocuments();
      const ParentNumber = await Parents.countDocuments();
      const CenterNumber = await Center.countDocuments();
      const AppointmentNumber = await Appointment.countDocuments();
      res.status(200).json({
        appointmentStatus,
        appointmentDates,
        workerNumber,
        ParentNumber,
        CenterNumber,
        AppointmentNumber,
        LatestfiveAppointments,
      });
    } catch (e) {
      return next(new ErrorHandler(e, 403));
    }
  })
);

// Getting all appointments
router.get(
  "/get-all-appointments",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 20;

      if (req.user.role === "admin") {
        const allAppointments = await Appointment.find()
          .populate("requested_by")
          .populate("provided_by")
          .skip(startIndex)
          .limit(limit)
          .sort({
            created_at: -1,
          });

        // Cache the result with an expiration time

        res.status(200).json({ allAppointments });
      } else {
        return next(
          new ErrorHandler("You are not allowed to access this page.", 403)
        );
      }
    } catch (error) {
      return next(
        new ErrorHandler("An error has occurred. Please try again later.", 500)
      );
    }
  })
);

// Get single appointment
router.get(
  "/get-single-appointment/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;
      if (req.user) {
        const singleAppointment = await Appointment.findOne({
          _id: id,
        })
          .populate("requested_by")
          .populate("provided_by");
        const allProviders = await Workers.find({}, "name cnic");

        if (!singleAppointment) {
          return next(
            new ErrorHandler("The appointment must be deleted!!", 403)
          );
        }
        res.status(200).json({ singleAppointment, allProviders });
      } else {
        return next(
          new ErrorHandler("You are not allowed to access this page", 403)
        );
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Updating appointment status
router.put("/admin-update-appointment", async (req, res, next) => {
  try {
    const { id, status, compaign, provider } = req.body;

    // Check if the appointment exists before proceeding
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (status === "Cancel") {
      try {
        const deleteAppointment = await Appointment.findByIdAndDelete(id);
        if (!deleteAppointment) {
          return res
            .status(404)
            .json({ message: "Appointment not found or already deleted" });
        }
        res.status(200).json({ message: "deleted" });
      } catch (error) {
        res.status(500).json(error);
      }
    } else if (status === "Wait for Compaign") {
      try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
          id,
          {
            $set: {
              type: "Wait for Compaign",
            },
          },
          {
            new: true,
          }
        )
          .populate("requested_by")
          .populate("provided_by");
        if (!updatedAppointment) {
          return res
            .status(404)
            .json({ message: "Appointment not found or already deleted" });
        }
        await AdminTellUser({
          name: updatedAppointment.requested_by.name,
          email: updatedAppointment.requested_by.email,
          subject: "Appointment Scheduled",
          providerName: updatedAppointment.provided_by.name,
          providerContact: updatedAppointment.provided_by.contact,
          date: updatedAppointment.requested_date,
          message:
            "Your Request for scheduling an appointment  has been approved.Our E-Polio Team will soon visits you.Here are the details:",
        });
        await AdminTellworker({
          doctorEmail: updatedAppointment.provided_by.email,
          doctorName: updatedAppointment.provided_by.name,
          patientName: updatedAppointment.requested_by.name,
          date: updatedAppointment.requested_date,
          patientEmail: updatedAppointment.requested_by.email,
          patientPhone: updatedAppointment.requested_by.contact,
        });
        res.status(200).json(updatedAppointment);
      } catch (error) {
        res.status(500).json(error);
      }
    } else if (status === "Requested Doorstep") {
      try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
          id,
          {
            $set: {
              type: "Requested Doorstep",
            },
          },
          {
            new: true,
          }
        )
          .populate("requested_by")
          .populate("provided_by");
        if (!updatedAppointment) {
          return res
            .status(404)
            .json({ message: "Appointment not found or already deleted" });
        }
        await AdminTellUser({
          name: updatedAppointment.requested_by.name,
          email: updatedAppointment.requested_by.email,
          subject: "Appointment Scheduled",
          providerName: updatedAppointment.provided_by.name,
          providerContact: updatedAppointment.provided_by.contact,
          date: updatedAppointment.requested_date,
          message:
            "Your Request for scheduling an appointment  has been approved. You will recieve Door Step Facility by our E-Polio Team.Here are the details:",
        });
        await AdminTellworker({
          doctorEmail: updatedAppointment.provided_by.email,
          doctorName: updatedAppointment.provided_by.name,
          patientName: updatedAppointment.requested_by.name,
          date: updatedAppointment.requested_date,
          patientEmail: updatedAppointment.requested_by.email,
          patientPhone: updatedAppointment.requested_by.contact,
        });
        res.status(200).json(updatedAppointment);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        {
          $set: {
            status: status,
            compaign: compaign,
            provided_by: provider,
          },
        },
        {
          new: true,
        }
      )
        .populate("requested_by")
        .populate("provided_by");
      // Check if the update was successful
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      await AdminTellUser({
        name: updatedAppointment.requested_by.name,
        email: updatedAppointment.requested_by.email,
        subject: "Appointment Scheduled",
        providerName: updatedAppointment.provided_by.name,
        providerContact: updatedAppointment.provided_by.contact,
        date: updatedAppointment.requested_date,
        message:
          "Your Request for scheduling an appointment  has been approved. Here are the details:",
      });
      await AdminTellworker({
        doctorEmail: updatedAppointment.provided_by.email,
        doctorName: updatedAppointment.provided_by.name,
        patientName: updatedAppointment.requested_by.name,
        date: updatedAppointment.requested_date,
        patientEmail: updatedAppointment.requested_by.email,
        patientPhone: updatedAppointment.requested_by.contact,
      });
      res.status(200).json(updatedAppointment);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// Getting parent appointments
router.get(
  "/get-parent-appointments/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 20;
      const allAppointments = await Appointment.find({
        requested_by: req.params.id,
      })
        .populate("requested_by")
        .populate("provided_by")
        .skip(startIndex)
        .limit(limit)
        .sort({
          created_at: -1,
        });
      const allStatus = await Appointment.find(
        {
          requested_by: req.params.id,
        },
        "status"
      );
      // Cache the result with an expiration time

      res.status(200).json({ allAppointments, allStatus });
    } catch (error) {
      return next(
        new ErrorHandler("An error has occurred. Please try again later.", 500)
      );
    }
  })
);
// Getting parent appointments
router.get(
  "/get-worker-appointments/:id",
  isAuthenticated,
  CatchAsyncError(async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 20;

      const allAppointments = await Appointment.find({
        provided_by: req.params.id,
      })
        .populate("requested_by")
        .populate("provided_by")
        .skip(startIndex)
        .limit(limit)
        .sort({
          created_at: -1,
        });

      res.status(200).json({ allAppointments });
    } catch (error) {
      return next(
        new ErrorHandler("An error has occurred. Please try again later.", 500)
      );
    }
  })
);

module.exports = router;
