const express = require("express");
const loginRoutes = require("./routes/login");
const serverDrivenUIRoutes = require("./routes/SS-UI");
const cors = require("cors");
require("./database");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/login", loginRoutes);
app.use("/ui", serverDrivenUIRoutes);

module.exports = { app };
