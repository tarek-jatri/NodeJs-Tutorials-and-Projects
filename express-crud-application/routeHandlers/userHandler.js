//=> Importing
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");

//=> Router Setup
const router = express.Router();

//=> Creating model of user schema
const User = mongoose.model("User", userSchema);

//=> Routing
// GET ALL USERS
router.get("/all", async (req, res) => {
  //
  try {
    const users = await User.find()
      .select({
        _id: 0,
        __v: 0,
      })
      .populate("todos", "title description status -_id");
    res.status(200).json({
      result: users,
    });
  } catch {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "User signed up successfully!!!",
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      error: "Failed to sign up !!!",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // check if username exists or not
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        //  Generate Token
        const token = jwt.sign(
          {
            userId: user[0]._id,
            username: user[0].username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          access_token: token,
          message: "Login Successfull",
        });
      } else {
        res.status(401).json({
          error: "Authentication Error!!!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication Error!!!",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication Error!!!",
    });
  }
});

//=> Exporting
module.exports = router;
