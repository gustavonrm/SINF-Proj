const express = require("express");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const { on } = require("./db/db");
const overview = require("./routes/overview");
const sales = require("./routes/sales");
const purchases = require("./routes/purchases");
const financial = require("./routes/financial");
const inventory = require("./routes/inventory");
const accounts = require("./routes/accounts");

const app = express();

app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(json());

on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/api/overview", overview);
app.use("/api/sales", sales);
app.use("/api/purchases", purchases);
app.use("/api/financial", financial);
app.use("/api/inventory", inventory);
app.use("/api/accounts", accounts);
app.use((req, res) => {
  const err = new Error("Not Found");
  err.status = 404;
  res.status(404).json({
    message: err.message,
    error: err,
  });
});

const port = 3000;
app.listen(port);
console.log("Server started.");

module.exports = app;
