import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

 
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ message: "Tasks fetched", data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});


router.post("/", async (req, res) => {
  try {
    
    const task = new Task(req.body);
    const savedTask = await task.save();


    if (req.body.assignedUserName) {
      const user = await User.findOne({ name: req.body.assignedUserName });
      if (user) {
      
        user.pendingTasks.push(savedTask._id);
        await user.save();

        savedTask.assignedUser = user._id;
        await savedTask.save();
      }
    }

    
    res.status(201).json({
      message: "Task created and linked",
      data: savedTask,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
  }
});


import mongoose from "mongoose";

router.put("/:id", async (req, res) => {
  try {

    const id = req.params.id.replace(/['"]+/g, "").trim();


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
});

export default router;


import mongoose from "mongoose";

router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE request received with ID:", req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ObjectId:", req.params.id);
      return res.status(400).json({ message: "Invalid Task ID format", id: req.params.id });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found", data: null });
    }

    if (task.assignedUser) {
      const user = await User.findById(task.assignedUser);
      if (user) {
        user.pendingTasks = user.pendingTasks.filter(
          (t) => t.toString() !== task._id.toString()
        );
        await user.save();
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    console.error("Delete task failed:", error);
    res.status(500).json({
      message: "Error deleting task",
      error: error.message || error,
    });
  }
});