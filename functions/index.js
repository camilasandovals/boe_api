import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import myRoutes from "./src/routes/myRoutes.js";
import { MONGOURI, MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX } from "./env.js";
import path from 'path';
import { fileURLToPath } from 'url';
import mailchimp from '@mailchimp/mailchimp_marketing'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", myRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX
});

async function testMailchimp() {
  try {
    const response = await mailchimp.ping.get();
    console.log("Mailchimp connection successful:", response);
  } catch (error) {
    console.error("Error connecting to Mailchimp:", error);
  }
}


// Mongoose connection
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connection to MongoDB established");
});

// Define the port for local development
const port = process.env.PORT || 3001;

// Start the server for local development
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  testMailchimp();
});

// Export the API as a Firebase Cloud Function
export const api = functions.https.onRequest(app);


