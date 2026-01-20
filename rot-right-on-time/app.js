require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const appointmentsRoutes = require("./routes/appointments.routes");
app.use("/api/appointments", appointmentsRoutes);

const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);

const providersRoutes = require("./routes/providers.routes");
app.use("/api/providers", providersRoutes);

require("./error-handling")(app);

module.exports = app;
