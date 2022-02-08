const express = require("express");
const app = express();

// app.use(
//   express.static(`${__dirname}/public/`, {
//     index: "home.html",
//   })
// );

app.set("view engine", "ejs");

app
  .route("/about/mission")
  .get((req, res) => {
    res.render("pages/about");
  })
  .post((req, res) => {
    res.send("Welcome to application home post");
  })
  .put((req, res) => {
    res.send("Welcome to application home put");
  });

/**
 * app.param()
app.param("id", (req, res, next, id) => {
  //  creating user
  const user = {
    userid: id,
    name: "Abir Hossain",
  };

  req.user = user;
  next();
});

app.get("/user/:id", (req, res) => {
  console.log(req.user);
  res.send("This is home page using post");
});

 */

app.listen(3030, () => {
  console.log("Connection listening on 3030");
});
