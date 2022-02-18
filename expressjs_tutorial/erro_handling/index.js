const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      console.log(a);
    } catch (e) {
      next(e);
    }
  }, 10);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next("There was a problem");
  } else {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("There is an error");
    }
  }
});

app.listen(3030, () => {
  console.log("Listening to port 3030");
});
