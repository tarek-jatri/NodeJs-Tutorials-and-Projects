const express = require("express");
const publicRouter = express.Router();

publicRouter.param((param, option) => (req, res, next, val) => {
  if (val === option) next();
  else res.sendStatus(403);
});

publicRouter.param("user", "12");

// publicRouter.get("/:user", (req, res, next) => {
//   console.log("This user method also matches");
//   next();
//   // res.end();
// });

publicRouter.get("/:user", (req, res) => {
  res.send(`Public: Hello Admin`);
});

publicRouter.get("/about", (req, res) => {
  res.send("Public About");
});

module.exports = publicRouter;
