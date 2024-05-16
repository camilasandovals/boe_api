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

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

let resumesFolder;

connection.once('open', () => {
  resumesFolder = new GridFSBucket(connection.db, {
    bucketName: 'resumes'
  });
});

// let avatarsFolder;

// connection.once('open', () => {
//   avatarsFolder = new GridFSBucket(connection.db, {
//     bucketName: 'avatars'
//   });
// });


// let logosFolder;

// connection.once('open', () => {
//   logosFolder = new GridFSBucket(connection.db, {
//     bucketName: 'logos'
//   });
// });

mongoose.connection.on("connected", () => {
  testMailchimp();
});


// app.listen(3004, () => {
//   console.log(`Server is running on port 3004`);
// });

export { resumesFolder };
export const api = functions.https.onRequest(app);
