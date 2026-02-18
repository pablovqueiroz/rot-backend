const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const Provider = require("../models/Provider.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const upload = require("../middlewares/upload.middleware");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
const BACKEND_URL =
  process.env.BACKEND_URL ||
  `http://localhost:${process.env.PORT || 5005}`;

if (!passport._strategy("google")) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account has no email."), null);
          }

          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          const existingProvider = await Provider.findOne({ email });
          if (existingProvider) {
            return done(null, false);
          }

          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.image?.url && profile.photos?.[0]?.value) {
              user.image = {
                url: profile.photos[0].value,
                public_id: `google_${profile.id}`,
              };
            }
            await user.save();
            return done(null, user);
          }

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName || email.split("@")[0],
            email,
            image: profile.photos?.[0]?.value
              ? {
                  url: profile.photos[0].value,
                  public_id: `google_${profile.id}`,
                }
              : undefined,
            role: "user",
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      errorMessage: "Google OAuth is not configured on the server.",
    });
  }

  return next();
}, passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed` }),
  (req, res) => {
    const payload = {
      _id: req.user._id,
      role: "user",
      email: req.user.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    const successRedirect = process.env.GOOGLE_SUCCESS_REDIRECT || `${FRONTEND_URL}/dashboard`;
    const separator = successRedirect.includes("?") ? "&" : "?";

    return res.redirect(`${successRedirect}${separator}token=${encodeURIComponent(authToken)}`);
  },
);

// Creates user
router.post("/signup/user", upload.single("image"), async (req, res) => {
  try {
    const { email, password, confirmPassword, name, phone } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        errorMessage: "Passwords do not match.",
      });
    }

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

    const payload = {
      _id: createdUser._id,
      role: "user",
      email: createdUser.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return res.status(201).json({ authToken });
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
    const { email, password, confirmPassword, name, phone } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        errorMessage: "Passwords do not match.",
      });
    }

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

    const payload = {
      _id: createdProvider._id,
      role: "provider",
      email: createdProvider.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return res.status(201).json({ authToken });
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

//change password
router.put("/change-password", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const account =
      (await User.findById(req.payload._id).select("+password")) ||
      (await Provider.findById(req.payload._id).select("+password"));

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isPasswordCorrect = bcryptjs.compareSync(
      currentPassword,
      account.password,
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(newPassword, salt);

    account.password = hashedPassword;
    await account.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Verify token
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json({ decodedToken: req.payload });
});

module.exports = router;
