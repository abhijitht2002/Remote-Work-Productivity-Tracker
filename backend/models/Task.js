import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },

    start_date: Date,
    due_date: Date,

    /*  manager */
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*  employee    */
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// mongoose pagination plugin
taskSchema.plugin(mongoosePaginate);

export default mongoose.model("Task", taskSchema);
