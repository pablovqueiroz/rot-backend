const router = require("express").Router();
const Appointment = require("../models/Appointment.model");
const Provider = require("../models/Provider.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { isUser, isProvider } = require("../middlewares/role.middleware");

// Creates a new appointment (user only)
router.post("/", isAuthenticated, isUser, async (req, res) => {
  try {
    const { provider, service, date, startTime, endTime, notes } = req.body;

    if (!provider || !service || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const providerExists = await Provider.findById(provider);
    if (!providerExists || !providerExists.isActive) {
      return res.status(404).json({ message: "Provider not found." });
    }

    const appointment = await Appointment.create({
      provider,
      client: req.payload._id,
      service,
      date,
      startTime,
      endTime,
      notes,
    });

    return res.status(201).json(appointment);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Time slot unavailable." });
  }
});

// Lists appointments for logged user or provider
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const filter =
      req.payload.role === "provider"
        ? { provider: req.payload._id }
        : { client: req.payload._id };

    const appointments = await Appointment.find(filter)
      .populate("provider", "name email phone")
      .populate("client", "name email phone");

    return res.status(200).json(appointments);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Retrieves a specific appointment by id
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("provider", "name")
      .populate("client", "name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (
      appointment.client.toString() !== req.payload._id &&
      appointment.provider.toString() !== req.payload._id
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Updates appointment status (provider only)
router.patch("/:id/status", isAuthenticated, isProvider, async (req, res) => {
  console.log("TOKEN PROVIDER ID:", req.payload._id);
  console.log("APPOINTMENT ID:", req.params.id);
  try {
    const { status } = req.body || {};

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, provider: req.payload._id },
      { status },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Cancels an appointment (user or provider)
router.patch("/:id/cancel", isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (
      appointment.client.toString() !== req.payload._id &&
      appointment.provider.toString() !== req.payload._id
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    appointment.status = "cancelled";
    appointment.cancelledAt = new Date();
    await appointment.save();

    return res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
