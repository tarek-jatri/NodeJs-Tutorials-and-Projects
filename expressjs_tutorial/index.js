const express = require("express");
const app = express();

const adminRouter = express.Router();

const loggerWrapper = (option) => (req, res, next) => {
  if (option.log) {
    console.log(
      `${new Date(Date.now()).toLocaleString()} - ${req.method} - ${
        req.originalUrl
      } - ${req.protocol} - ${req.ip}`
    );
    next();
  } else {
    throw new Error("This is an error!!!");
  }
};

const logger = (req, res, next) => {
  console.log(
    `${new Date(Date.now()).toLocaleString()} - ${req.method} - ${
      req.originalUrl
    } - ${req.protocol} - ${req.ip}`
  );
  throw new Error("This is an error!!!");
};

adminRouter.use(
  loggerWrapper({
    log: false,
  })
);

app.use("/admin", adminRouter);

adminRouter.get("/dashboard", (req, res) => {
  res.send("Admin Dashboard");
});

app.get("/about", (req, res) => {
  res.send("About GET");
});
app.post("/about", (req, res) => {
  res.send("About POST");
});

const errorMiddleware = (err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("There is a server side error!!!!");
};

adminRouter.use(errorMiddleware);

app.listen(3030, () => {
  console.log("Listening server to 3030");
});
