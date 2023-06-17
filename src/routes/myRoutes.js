import express from "express";
// import { signUp, login, addUserInfo, getUser } from "../controllers/users.js";
import { getSchools } from "../controllers/schools.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to BOE");
});

// router.post("/signup", signUp);
// router.post("/login", login);
// router.patch("/users/:docId", addUserInfo);
// router.get("/users/:docId", getUser);
router.get("/schools", getSchools);
// router.get("/schools/:docId", selectedSchool);

export default router;