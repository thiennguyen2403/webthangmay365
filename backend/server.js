import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/director", directorRoutes);
app.use("/api", roleRoutes);

app.get("/", async (req, res) => {
  await db.query("SELECT 1");
  res.json({ message: "Backend Thang Máy 365 + MySQL hoạt động" });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
