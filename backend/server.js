import express from "express";
import dotenv from "dotenv";
import workoutRoutes from "./routes/workoutRoutes.js";
import connectDB from "./config/db.js";
import * as dns from "node:dns";
import cors from "cors";

// load environment variables before anything else
dotenv.config();

const app = express();

// enable CORS after app is created
app.use(cors());

dns.setServers(["1.1.1.1", "8.8.8.8"]);



const PORT = process.env.PORT || 3001;


app.use(express.json());


app.use("/workouts", workoutRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/workouts`);
    });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
