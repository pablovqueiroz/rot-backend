const router = require("express").Router();
const Provider = require("../models/Provider.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { isProvider } = require("../middlewares/role.middleware");

// Lists all active providers (public)
router.get("/", async (req, res) => {
  try {
    const providers = await Provider.find({ isActive: true }).select("-password");
    return res.status(200).json(providers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Retrieves logged provider profile
router.get("/me", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id).select("-password");
    return res.status(200).json(provider);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Updates logged provider profile
router.put("/me", isAuthenticated, isProvider, async (req, res) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.payload._id,
      req.body,
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedProvider);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Deletes logged provider account
router.delete("/me", isAuthenticated, isProvider, async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.payload._id);
    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Adds a new service to logged provider
router.post("/services", isAuthenticated, isProvider, async (req, res) => {
  try {
    const { name, price, durationMinutes } = req.body;

    if (!name || !price || !durationMinutes) {
      return res.status(400).json({ errorMessage: "Missing required fields." });
    }

    const provider = await Provider.findById(req.payload._id);

    provider.services.push({ name, price, durationMinutes });
    await provider.save();

    return res.status(201).json(provider.services);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Updates a provider service
router.put("/services/:serviceId", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id);
    const service = provider.services.id(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ errorMessage: "Service not found." });
    }

    Object.assign(service, req.body);
    await provider.save();

    return res.status(200).json(service);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Removes a provider service
router.delete("/services/:serviceId", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id);
    const service = provider.services.id(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ errorMessage: "Service not found." });
    }

    service.remove();
    await provider.save();

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Updates provider availability
router.put("/availability", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id);

    provider.availability = req.body;
    await provider.save();

    return res.status(200).json(provider.availability);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Retrieves a provider by id (public)
router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select("-password");

    if (!provider || !provider.isActive) {
      return res.status(404).json({ errorMessage: "Provider not found." });
    }

    return res.status(200).json(provider);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

module.exports = router;
