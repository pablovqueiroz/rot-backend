const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Malformed token." });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { isAuthenticated };
