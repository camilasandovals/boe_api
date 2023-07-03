import express from "express";
// import { signUp, login, addUserInfo, getUser } from "../controllers/users.js";
import { login, signUp, getUser } from "../controllers/users.js";
import { getSchools } from "../controllers/schools.js";
import { getBlogs } from "../controllers/blogs.js";
import { getEvents } from "../controllers/events.js";

const router = express.Router();

router.get("/api", (req, res) => {
  res.send("Welcome to BOE");
});

router.post("/signup", signUp);
router.post("/login", login);
// router.patch("/users/:docId", addUserInfo);
router.post("/api/users", getUser);
router.get("/api/schools", getSchools);
router.get("/api/blogs", getBlogs);
router.get("/api/events", getEvents);

// router.get("/schools/:docId", selectedSchool);

export default router;