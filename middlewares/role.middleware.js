function isProvider(req, res, next) {
  if (!req.payload || req.payload.role !== "provider") {
    return res
      .status(403)
      .json({ message: "Only providers are allowed to access this resource" });
  }

  next();
}

function isUser(req, res, next) {
  if (!req.payload || req.payload.role !== "user") {
    return res
      .status(403)
      .json({ message: "Only users are allowed to access this resource" });
  }

  next();
}

module.exports = {
  isProvider,
  isUser,
};
