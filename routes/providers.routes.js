const router = require("express").Router();
const Provider = require("../models/Provider.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { isProvider } = require("../middlewares/role.middleware");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");

// Lists all active providers (public)
router.get("/", async (req, res) => {
  try {
    const providers = await Provider.find({ isActive: true }).select(
      "-password",
    );
    return res.status(200).json(providers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Retrieves logged provider profile
router.get("/me", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id).select(
      "-password",
    );
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
      { new: true },
    ).select("-password");

    return res.status(200).json(updatedProvider);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

//update image
router.put("/image", isAuthenticated, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image?.url || !image?.public_id) {
      return res.status(400).json({ message: "Image is required." });
    }

    const provider = await Provider.findById(req.payload._id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found." });
    }

    if (provider.image?.public_id) {
      await cloudinary.uploader.destroy(provider.image.public_id);
    }

    provider.image = image;
    await provider.save();

    return res.json(provider.image);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Deletes logged provider account
router.delete("/me", isAuthenticated, isProvider, async (req, res) => {
  try {
    const provider = await Provider.findById(req.payload._id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found." });
    }

    if (provider.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(provider.image.public_id);
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr);
      }
    }

    await Provider.findByIdAndDelete(req.payload._id);

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Adds a new service
router.post("/services", isAuthenticated, isProvider, async (req, res) => {
  try {
    const { name, description, price, durationMinutes } = req.body;

    if (!name || !price || !durationMinutes) {
      return res.status(400).json({ errorMessage: "Missing required fields." });
    }
    const provider = await Provider.findById(req.payload._id);
    provider.services.push({
      id: crypto.randomUUID(),
      name,
      description,
      price,
      durationMinutes,
    });
    await provider.save();
    return res.status(201).json(provider.services);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Updates a provider service
router.put(
  "/services/:serviceId",
  isAuthenticated,
  isProvider,
  async (req, res) => {
    try {
      const provider = await Provider.findById(req.payload._id);

      const service = provider.services.find(
        (service) => service.id === req.params.serviceId,
      );

      if (!service) {
        return res.status(404).json({ errorMessage: "Service not found." });
      }

      if (
        req.body.price !== undefined &&
        Number.isNaN(Number(req.body.price))
      ) {
        return res.status(400).json({ errorMessage: "Invalid price" });
      }

      if (
        req.body.durationMinutes !== undefined &&
        Number.isNaN(Number(req.body.durationMinutes))
      ) {
        return res.status(400).json({ errorMessage: "Invalid duration" });
      }

      service.name = req.body.name ?? service.name;
      service.description = req.body.description ?? service.description;
      service.price = req.body.price ?? service.price;
      service.durationMinutes =
        req.body.durationMinutes ?? service.durationMinutes;

      await provider.save();

      return res.status(200).json(service);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errorMessage: "Internal server error" });
    }
  },
);

// delete a provider service
router.delete(
  "/services/:serviceId",
  isAuthenticated,
  isProvider,
  async (req, res) => {
    try {
      const provider = await Provider.findById(req.payload._id);

      const initialLength = provider.services.length;

      provider.services = provider.services.filter(
        (service) => service.id !== req.params.serviceId,
      );

      if (provider.services.length === initialLength) {
        return res.status(404).json({ errorMessage: "Service not found." });
      }

      await provider.save();
      return res.status(204).send();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errorMessage: "Internal server error" });
    }
  },
);

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
