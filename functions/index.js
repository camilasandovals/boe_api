import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { GridFSBucket } from "mongodb";
import myRoutes from "./src/routes/myRoutes.js";
import { MONGOURI, MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX } from "./env.js";
import mailchimp from "@mailchimp/mailchimp_marketing";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", myRoutes);

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX,
});

function testMailchimp() {
  try {
    mailchimp.ping.get();
  } catch (error) {
    console.error("Error connecting to Mailchimp:", error);
  }
}


let gfs;
let bucket;

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  const db = mongoose.connection.db;
  gfs = new GridFSBucket(db, { bucketName: "resumes" });
  bucket = new GridFSBucket(db, { bucketName: "files" });
  console.log("Connected to MongoDB and set up GridFS");
  testMailchimp();
});




// app.listen(3004, () => {
//   console.log(`Server is running on port 3004`);
// });

// Export the API as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
