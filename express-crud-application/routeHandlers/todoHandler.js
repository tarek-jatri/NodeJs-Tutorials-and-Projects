//=> Importing
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

//=> Router setup
const router = express.Router();

// Creating model of schema todo
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// get all the todos
router.get("/", checkLogin, async (req, res) => {
  await Todo.find()
    .select({
      _id: 0,
      __v: 0,
    })
    .populate("user", "name username -_id")
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!!",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "Todos were inserted successfully!!",
        });
      }
    });
});

// get all the todos using async await
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

// get all the todos using callback
router.get("/active-callback", async (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    if (!err) {
      res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({
        error: err,
      });
    }
  });
});

// get todos using static methos
router.get("/js", async (req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({
    data,
  });
});

// get todos using query helpers
router.get("/language", async (req, res) => {
  const data = await Todo.find().byLanguage("react");
  res.status(200).json({
    data,
  });
});

// get a todo by id
router.get("/:id", async (req, res) => {
  await Todo.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!!",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Todos were inserted successfully!!",
      });
    }
  }).clone();
});

// post a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    const up = await User.findByIdAndUpdate(
      { _id: req.userId },
      {
        $push: { todos: todo._id },
      }
    );
    console.log(up);
    res.status(200).json({
      message: "Todo was inserted successfully!!",
    });
  } catch {
    res.status(500).json({
      error: "There was a server side error!!",
    });
  }
});

// post multiple todos
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!!",
      });
    } else {
      res.status(200).json({
        message: "Todos were inserted successfully!!",
      });
    }
  });
});

// put todo
router.put("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
    },
    {},
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!!",
        });
      } else {
        res.status(200).json({
          message: "Todos were updated successfully!!",
        });
      }
    }
  ).clone();
});

// delete a todoby id
router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!!",
      });
    } else {
      res.status(200).json({
        message: "Todos was deleted successfully!!",
      });
    }
  }).clone();
});

//=> Exporting router
module.exports = router;

// const obj = [
//   {
//     title: "Learn Vanilla JS",
//     description: "learn it from w3schools",
//     status: "active",
//   },
//   {
//     title: "Learn Node JS",
//     description: "learn it from LWS youtube channel",
//     status: "active",
//   },
//   {
//     title: "Learn Express JS",
//     description: "learn it from  LWS youtube channel",
//     status: "inactive",
//   },
//   {
//     title: "Learn React JS",
//     description: "learn it from  LWS youtube channel",
//     status: "inactive",
//   },
// ];
