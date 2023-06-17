import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import myRoutes from "./src/routes/myRoutes.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", myRoutes);

//mongoose connection
const mongoUri  = process.env.MONGOURI;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log("Connection to Mongo Database established");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});