import express from "express";
import Busboy from 'busboy';
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
import { getMessages, createMessage, getUserMessages } from "../controllers/messages.js";
import { authenticateToken } from "../middlewares/token.js";
import { resumesFolder } from "../../index.js";
import { Buffer } from 'buffer'

const router = express.Router();

router.get("/api", (req, res) => {
  res.send("Welcome to BOE");
});

router.post("/api/signup", signUp);
router.post("/api/login", login);
router.get("/api/members", getMembers);
router.post("/api/members/signup", signUpMember);
router.get("/api/programs", authenticateToken, getProgramsWithSchools);
router.post("/api/programs", authenticateToken, addProgramsWithSchools);
router.get("/memberPrograms", authenticateToken, getSchoolPrograms);
router.get("/api/events", getEvents);
router.get("/api/blogs", getBlogs);
router.post("/subscribe", subscribe);
router.patch(
  "/api/users",
  authenticateToken,
  addUserInfo
);
router.get("/userlikes", authenticateToken, getUserLikes);
router.get("/memberlikes", authenticateToken, getMemberLikes);
router.post("/userlikes", authenticateToken, addLike);
router.post('/premiumApplication', authenticateToken, addPremiumApplication);
router.get("/premiumApplication", authenticateToken, getPremiumApplication);
router.get("/memberApplications", authenticateToken, getMemberApplications);
router.get("/messages", authenticateToken, getMessages);
router.get("/userMessages", authenticateToken, getUserMessages);
router.post("/messages", createMessage);
router.post("/verify", verifyMember);
router.delete("/api/programs/:id", deleteProgram);


export default router;
