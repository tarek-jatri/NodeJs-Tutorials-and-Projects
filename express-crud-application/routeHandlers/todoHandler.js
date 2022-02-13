//=> Imporitng 
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");

//=> Router setup
const router = express.Router();

// Creating model of schema todo
const Todo = new mongoose.model("Todo", todoSchema);

// get all the todos
router.get("/", async (req, res) => {
    await Todo.find({ status: "active" })
        .select({
            _id: 0,
            date: 0,
            __v: 0
        })
        .limit(2)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!!"
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Todos were inserted successfully!!"
                });
            }
        });
});

// get a todo by id
router.get("/:id", async (req, res) => {
    await Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!!"
            });
        } else {
            res.status(200).json({
                result: data,
                message: "Todos were inserted successfully!!"
            });
        }
    }).clone();
});

// post a todo
router.post("/", async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save(err => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!!"
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully!!"
            });
        }
    });
});

// post multiple todos
router.post("/all", async (req, res) => {
    await Todo.insertMany(req.body, err => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!!"
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!!"
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
        {

        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!!"
                });
            } else {
                res.status(200).json({
                    message: "Todos were updated successfully!!"
                });
            }
        }).clone();

    console.log(todo);
});

// delete a todoby id
router.delete("/:id", async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!!"
            });
        } else {
            res.status(200).json({
                message: "Todos was deleted successfully!!"
            });
        }
    }).clone();
});


//=> Exporting router
module.exports = router;