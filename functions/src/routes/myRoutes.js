import express from "express";
import multer from "multer";
import { login, signUp, addUserInfo } from "../controllers/users.js";
import {
  getMembers,
  signUpMember,
  verifyMember,
} from "../controllers/schools.js";
import {
  getProgramsWithSchools,
  addProgramsWithSchools,
  getSchoolPrograms,
  deleteProgram,
} from "../controllers/programs.js";
import { subscribe } from "../controllers/suscriber.js";
import { getBlogs } from "../controllers/blogs.js";
import { getEvents } from "../controllers/events.js";
import {
  getUserLikes,
  addLike,
  getMemberLikes,
} from "../controllers/userlikes.js";
import {
  addPremiumApplication,
  getPremiumApplication,
  getMemberApplications,
} from "../controllers/premiumApplication.js";
import { getMessages, createMessage } from "../controllers/messages.js";
import { authenticateToken } from "../middlewares/token.js";
import { GridFsStorage } from "multer-gridfs-storage";
import { MONGOURI } from "../../env.js";

const resumes = new GridFsStorage({
  url: MONGOURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: "resumes", 
    };
  },
});

const resumesFolder = multer({ storage: resumes });

const avatars = new GridFsStorage({
  url: MONGOURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: "avatars", 
    };
  },
});

const avatarsFolder = multer({ storage: avatars });

const logos = new GridFsStorage({
  url: MONGOURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: "logos", 
    };
  },
});

const logosFolder = multer({ storage: logos });

const router = express.Router();

router.get("/api", (req, res) => {
  res.send("Welcome to BOE");
});

router.post("/api/signup", signUp);
router.post("/api/login", login);
router.get("/api/members", getMembers);
router.post("/api/members/signup", logosFolder.single("logo"), signUpMember);
router.get("/api/programs", authenticateToken, getProgramsWithSchools);
router.post("/api/programs", authenticateToken, addProgramsWithSchools);
router.get("/memberPrograms", authenticateToken, getSchoolPrograms);
router.get("/api/events", getEvents);
router.get("/api/blogs", getBlogs);
router.post("/subscribe", subscribe);
router.patch(
  "/api/users",
  authenticateToken,
  avatarsFolder.single("avatar"),
  addUserInfo
);
router.get("/userlikes", authenticateToken, getUserLikes);
router.get("/memberlikes", authenticateToken, getMemberLikes);
router.post("/userlikes", authenticateToken, addLike);
router.post(
  "/premiumApplication",
  authenticateToken,
  resumesFolder.single("resume"),
  addPremiumApplication
);
router.get("/premiumApplication", authenticateToken, getPremiumApplication);
router.get("/memberApplications", authenticateToken, getMemberApplications);
router.get("/messages", authenticateToken, getMessages);
router.post("/messages", createMessage);
router.post("/verify", verifyMember);
router.delete("/api/programs/:id", deleteProgram);

export default router;
