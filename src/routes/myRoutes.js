import express from "express";
import { signUp, login, addUserInfo, getUser, selectedSchool, getMedInfo, addMedication, deleteMedication, updateMedication } from "../controllers/myControllers.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to my API");
});


router.post("/signup", signUp);
router.post("/login", login);
router.patch("/users/:docId", addUserInfo);
router.get("/users/:docId", getUser);
router.get("/schools", getSchools);
router.get("/schools/:docId", selectedSchool);

export default router;