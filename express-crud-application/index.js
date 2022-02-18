//=> Importing
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandlers/todoHandler");
const userHandler = require("./routeHandlers/userHandler");

//=> express app initialization
const app = express();
dotenv.config();
app.use(express.json());

//=> database connection with mongoose
mongoose
  .connect("mongodb://localhost:27017/todos")
  .then(() => console.log("Connection Successfull"))
  .catch((err) => console.log(err));

//=> application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

//=> default error handler
function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(3030, () => {
  console.log("CRUD app server listening to port 3030");
});
