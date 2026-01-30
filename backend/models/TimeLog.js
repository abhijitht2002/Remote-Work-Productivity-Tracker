import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      default: null,
    },
    duration_seconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("TimeLog", timeLogSchema);
