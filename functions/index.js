import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import myRoutes from "./src/routes/myRoutes.js";
import { MONGOURI } from "./env.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", myRoutes);

// Mongoose connection
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connection to MongoDB established");
});

// Export the API as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
