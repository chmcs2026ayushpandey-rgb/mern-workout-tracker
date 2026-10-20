import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as dns from "node:dns";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import measurementRoutes from "./routes/measurementRoutes.js";
import connectDB from "./config/db.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// DNS workaround kept from the original project
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/goals", goalRoutes);
app.use("/measurements", measurementRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/reminders", reminderRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();