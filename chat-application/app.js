//=> External Imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

//=> Internal Imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const loginRouter = require("./router/loginRouter");
const userRouter = require("./router/userRouter");
const inboxRouter = require("./router/inboxRouter");

//=> setting
const app = express();
dotenv.config();

//=> Database Connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Chat database connection successful");
  })
  .catch((err) => console.log(err));

//=> Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//=> Set View Engine
app.set("view engine", "ejs");

//=> Set Static folder
app.use(express.static(path.join(__dirname, "public")));

//=> Parse Cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//=> Routing Setup
app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/inbox", inboxRouter);

//=> Error Handling
// 404 Not found handler
app.use(notFoundHandler);
// common default error handler
app.use(errorHandler);

//=> Server Start
app.listen(process.env.PORT, () => {
  console.log(`Chat app listening to port ${process.env.PORT}`);
});
