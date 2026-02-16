import express from "express";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import managerRoutes from "./routes/manager.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/notes.routes.js";
import cors from "cors";
import env from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://remote-work-productivity-tracker.vercel.app",
    // credentials: true,
  }),
);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/notes", noteRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port http://localhost:${env.port}`);
});
