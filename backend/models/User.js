import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
  },
  { timestamps: true },
);

// mongoose pagination plugin
userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
