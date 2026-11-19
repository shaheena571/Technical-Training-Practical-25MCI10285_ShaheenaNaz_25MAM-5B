const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/auth");

const router = express.Router();

// every route in this file needs the user to be logged in
router.use(protect);

// GET /api/tasks - get all tasks of the logged in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not get tasks" });
  }
});

// POST /api/tasks - add a new task
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({ title: title.trim(), user: req.userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not add task" });
  }
});

// PUT /api/tasks/:id - mark done / not done
router.put("/:id", async (req, res) => {
  try {
    // user: req.userId makes sure you can only change your own task
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not update task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task" });
  }
});

module.exports = router;
