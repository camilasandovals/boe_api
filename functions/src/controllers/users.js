import { hashSync } from "bcrypt";
import User from "../models/userSchema.js";
import { salt } from "../../env.js";
import Member from "../models/schoolSchema.js";
import sharp from "sharp";
import mongoose from "mongoose";
import { secretKey } from "../../env.js";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
  try {
    const { email, password, name, lastName } = req.body;

    if (!email || (password && password.length < 8)) {
      res.status(400).send({
        message:
          "Email and password are required. Password must be 8 characters or longer",
      });
      return;
    }

    const doc = await User.findOne({ email: email.toLowerCase() });
    if (doc) {
      res.status(401).send({
        message: "Email already exists. Please try logging in instead",
      });
      return;
    }

    const hashedPassword = hashSync(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword || null,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, secretKey);

    const userResponse = {
      email: savedUser.email,
      token: token,
      type: "user",
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "an error",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).send({ message: "Email and password both required" });
      return;
    }
    const hashedPassword = hashSync(password, salt);
    let user = await User.findOne({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    let type = "user";
    if (!user) {
      user = await Member.findOne({
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      if (user && user.isVerified == false) {
        res
          .status(401)
          .send({ message: "Check your email to verify your account" });
      }
      type = "member";
      if (!user) {
        res.status(401).send({ message: "Invalid email or password" });
        return;
      }
    }

    const token = jwt.sign({ id: user._id }, secretKey);
    let userResponse = {};
    if (type == "user") {
      userResponse = {
        type: type,
        email: user.email,
        token: token,
        name: user.name,
        lastName: user.lastName,
        location: user.location,
        category: user.category,
        bio: user.bio,
        skills: user.skills,
      };
    } else {
      userResponse = {
        name: user.name,
        website: user.website,
        industry: user.industry,
        type: "member",
        email: user.email,
        typeOf: user.type,
        token: token,
        description: user.description,
      };
    }
    res.status(200).send(userResponse);
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "An error occurred",
    });
  }
}

export async function addUserInfo(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const filter = { _id: userId };

    // Create update object from req.body
    let update = { $set: req.body };

    // Handling multipart/form-data for arrays
    if (req.body["skills[]"]) {
      let skills = req.body["skills[]"];
      // Ensure it's always an array
      if (typeof skills === "string") {
        skills = [skills];
      }
      update.$set.skills = skills;
    }

    // Check if an avatar file is uploaded
    if (req.file) {
      const avatar = req.file;
      update.$set.avatar = avatar.filename;
    }

    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    const token = jwt.sign({ id: updatedUser._id }, secretKey);

    if (updatedUser) {
      const userResponse = {
        type: "user",
        email: updatedUser.email,
        token: token,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        location: updatedUser.location,
        category: updatedUser.category,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
      };
      res
        .status(200)
        .send({ user: userResponse, message: "User updated successfully." });
    } else {
      res.status(404).send({ message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error updating user", error: error.message });
  }
}
