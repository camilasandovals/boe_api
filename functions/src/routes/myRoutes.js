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
import fs from "fs";
import path from "path";

const storageForResumes = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "resumes/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const storageForlogos = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = "logo/";
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const storageForAvatars = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = "avatar/";
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// const filterResumes = function (req, file, cb) {
//   if (!file.originalname.match(/\.(pdf)$/)) {
//     return cb(new Error("Only PDFs are allowed!"), false);
//   }
//   cb(null, true);
// };

const filterlogos = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const filterAvatars = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const resumes = multer({
  storage: storageForResumes,
  // fileFilter: filterResumes,
});
const logos = multer({
  storage: storageForlogos,
  fileFilter: filterlogos,
});

const avatars = multer({
  storage: storageForAvatars,
  fileFilter: filterAvatars,
});

const router = express.Router();

router.get("/api", (req, res) => {
  res.send("Welcome to BOE");
});

router.post("/api/signup", signUp);
router.post("/api/login", login);
router.get("/api/members", getMembers);
router.post("/api/members/signup", logos.single("logo"), signUpMember);
router.get("/api/programs", authenticateToken, getProgramsWithSchools);
router.post("/api/programs", authenticateToken, addProgramsWithSchools);
router.get("/memberPrograms", authenticateToken, getSchoolPrograms);
router.get("/api/events", getEvents);
router.get("/api/blogs", getBlogs);
router.post("/subscribe", subscribe);
router.patch(
  "/api/users",
  authenticateToken,
  avatars.single("avatar"),
  addUserInfo
);
router.get("/userlikes", authenticateToken, getUserLikes);
router.get("/memberlikes", authenticateToken, getMemberLikes);
router.post("/userlikes", authenticateToken, addLike);
router.post(
  "/premiumApplication",
  authenticateToken,
  resumes.single("resume"),
  addPremiumApplication
);
router.get("/premiumApplication", authenticateToken, getPremiumApplication);
router.get("/memberApplications", authenticateToken, getMemberApplications);
router.get("/messages", authenticateToken, getMessages);
router.post("/messages", createMessage);
router.post("/verify", verifyMember);
router.delete("/api/programs/:id", deleteProgram);

export default router;
