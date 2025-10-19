import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedUserName: { type: String, default: "unassigned" },
  dateCreated: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);