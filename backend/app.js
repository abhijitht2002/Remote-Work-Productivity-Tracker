import express from "express";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import env from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port http://localhost:${env.port}`);
});
