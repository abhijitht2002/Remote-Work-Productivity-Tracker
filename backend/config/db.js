import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("mongodb connected");
  } catch (err) {
    console.log("mongodb connection error: ", err);
  }
};

export default connectDB;
