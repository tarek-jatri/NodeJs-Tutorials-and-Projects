const express = require("express");
const app = express();

app.use(express.raw());

app.get("/", (req, res) => {
  res.send("This is home page");
});

app.post("/", (req, res) => {
  console.log(typeof req.body);
  res.send("This is home page using post");
});

app.listen(3030, () => {
  console.log("Connection listening on 3030");
});
