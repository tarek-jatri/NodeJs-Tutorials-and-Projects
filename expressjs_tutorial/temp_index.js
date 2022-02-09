const express = require("express");
const app = express();

// app.use(
//   express.static(`${__dirname}/public/`, {
//     index: "home.html",
//   })
// );

app.set("view engine", "ejs");

// app
//   .route("/about/mission")
//   .get((req, res) => {
//     res.render("pages/about");
//   })
//   .post((req, res) => {
//     res.send("Welcome to application home post");
//   })
//   .put((req, res) => {
//     res.send("Welcome to application home put");
//   });

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

// app.get("/about", (req, res) => {
//   console.log(res.headersSent);
//   res.render("pages/about", {
//     name: "Bangladesh",
//   });
//   console.log(res.headersSent);
// });

app.get("/about", (req, res) => {
  // send method
  // res.send("About");
  // res.end();
  // json method
  // res.json({
  //   name: "Bangladesh",
  // });
  // status method
  // res.status(200);
  // res.end();
  // sendStatus method
  // res.sendStatus(403);
  // format method
  // res.format({
  //   "text/plain": () => {
  //     res.send("hi");
  //   },
  //   "text/html": () => {
  //     res.render("pages/about", {
  //       name: "Bangladesh",
  //     });
  //   },
  //   "application/json": () => {
  //     res.json({
  //       message: "About",
  //     });
  //   },
  //   default: () => {
  //     res.status(406).send("Not Acceptable");
  //   },
  // });
  //  cookie method
  // res.cookie("name", "learnwithsumit");
  // res.end();
  //  location method
  // res.location("/test");
  // res.redirect("/test");
  // res.end();
  //  set & get method
  res.set("Title", "Abir Hossain");
  console.log(res.get("Title"));
  res.end();
});

app.get("/test", (req, res) => {
  res.send("Hello");
});

// app.listen(3030, () => {
//   console.log("Connection listening on 3030");
// });
