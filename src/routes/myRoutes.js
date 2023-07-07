import express from "express";
// import { signUp, login, addUserInfo, getUser } from "../controllers/users.js";
import { login, signUp, getUser, addUserInfo } from "../controllers/users.js";
import { getSchools } from "../controllers/schools.js";
import { subscribe } from "../controllers/suscriber.js";
import { getBlogs } from "../controllers/blogs.js";
import { getEvents } from "../controllers/events.js";
import { addLike } from "../controllers/userlikes.js";

const router = express.Router();

router.get("/api", (req, res) => {
  res.send("Welcome to BOE");
});

router.post("/signup", signUp);
router.post("/login", login);
router.get("/api/schools", getSchools);
router.get("/api/events", getEvents);
router.get("/api/blogs", getBlogs);
router.post("/subscribe", subscribe);
router.patch("/api/users", addUserInfo);
router.post("/userlikes", addLike)
// router.post("/api/users", getUser);

// router.get("/schools/:docId", selectedSchool);

export default router;