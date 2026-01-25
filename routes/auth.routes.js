const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Provider = require("../models/Provider.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const upload = require("../middlewares/upload.middleware");

// Creates user
router.post("/signup/user", upload.single("image"), async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !req.file) {
      return res.status(400).json({
        errorMessage: "Provide email, password, name and profile image.",
      });
    }

    const existingUser = await User.findOne({ email });
    const existingProvider = await Provider.findOne({ email });

    if (existingUser || existingProvider) {
      return res.status(403).json({
        errorMessage: "Invalid credentials.",
      });
    }

    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    const safeUser = await User.findById(createdUser._id).select("-password");

    return res.status(201).json(safeUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errorMessage: "Internal server error",
    });
  }
});

// Creates provider
router.post("/signup/provider", upload.single("image"), async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name || !req.file) {
      return res.status(400).json({
        errorMessage: "Please fill in email, password, name and profile image.",
      });
    }
    const existingUser = await User.findOne({ email });
    const existingProvider = await Provider.findOne({ email });

    if (existingUser || existingProvider) {
      return res.status(403).json({
        errorMessage: "Invalid credentials.",
      });
    }

    const salt = bcryptjs.genSaltSync(12);

    const hashedPassword = bcryptjs.hashSync(password, salt);

    const createdProvider = await Provider.create({
      email,
      name,
      password: hashedPassword,
      phone,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      services: [],
      availability: [],
      isActive: true,
    });

    const safeProvider = await Provider.findById(createdProvider._id).select(
      "-password",
    );

    return res.status(201).json(safeProvider);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errorMessage: "Internal server error",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const account =
      (await User.findOne({ email }).select("+password")) ||
      (await Provider.findOne({ email }).select("+password"));

    if (!account) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    const isPasswordCorrect = bcryptjs.compareSync(password, account.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    const role =
      account.constructor.modelName === "Provider" ? "provider" : "user";

    const payload = {
      _id: account._id,
      role,
      email: account.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return res.status(200).json({ authToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// Verify token
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json({ decodedToken: req.payload });
});

module.exports = router;
