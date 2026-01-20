const router = require("express").Router();
const User = require("../models/User.model");
const Appointment = require("../models/Appointment.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { isUser } = require("../middlewares/role.middleware");


// Retrieves logged user profile
router.get("/me", isAuthenticated, isUser, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id).select("-password");

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found." });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ errorMessage: "Internal server error" });
  }
});


//debug
router.get("/", async (req,res) => {
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
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ errorMessage: "Internal server error" });
  }
});


// Lists appointments for logged user
router.get("/me/appointments", isAuthenticated, isUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      client: req.payload._id,
    })
      .populate("provider", "name services");

    return res.status(200).json(appointments);
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ errorMessage: "Internal server error" });
  }
});


// Deletes logged user account
router.delete("/me", isAuthenticated, isUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.payload._id);

    return res.status(204).send();
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ errorMessage: "Internal server error" });
  }
});

module.exports = router;
