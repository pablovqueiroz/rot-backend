const router = require("express").Router();
const User = require("../models/User.model");
const Appointment = require("../models/Appointment.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { isUser } = require("../middlewares/role.middleware");
const cloudinary = require("../config/cloudinary");

// Retrieves logged user profile
router.get("/me", isAuthenticated, isUser, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id).select("-password");

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found." });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

//debug
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    console.log("Users found");
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

// Updates logged user profile
router.put("/me", isAuthenticated, isUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      req.body,
      { new: true },
    ).select("-password");

    return res.status(200).json(updatedUser);
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

    const user = await User.findById(req.payload._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.image?.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }

    user.image = image;
    await user.save();

    return res.json(user.image);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Deletes logged user account
router.delete("/me", isAuthenticated, isUser, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);

    if (user?.image?.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }

    await User.findByIdAndDelete(req.payload._id);

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

module.exports = router;
