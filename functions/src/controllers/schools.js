import { hashSync } from "bcrypt";
import { salt } from "../../env.js";
import Members from "../models/schoolSchema.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { secretKey } from "../../env.js";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., 'smtp.gmail.com' for Gmail
  port: 587, // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: "info@boepartners.com",
    pass: "pgss adxo syut sfmv",
  },
});

export async function getMembers(req, res) {
  const members = await Members.find().sort({ name: 1, _id: 1 });
  res.status(200).send(members);
}

export async function getMember(req, res) {
  const member = await Members.findById(req.params.id);
  res.status(200).send(member);
}

export async function signUpMember(req, res) {

  try {
    const {
      email,
      password,
      name,
      website,
      organizationType,
      industry,
      description,
      logoUrl,

    } = req.body;
    if (!email || (password && password.length < 8)) {
      res.status(400).send({
        message:
          "Email and password are required. Password must be 8 characters or longer",
      });
      return;
    }

    const doc = await Members.findOne({ email: email.toLowerCase() });
    if (doc) {
      res.status(401).send({
        message: "Email already exists. Please try logging in instead",
      });
      return;
    }

    const hashedPassword = hashSync(password, salt);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newMembers = new Members({
      email: email.toLowerCase(),
      password: hashedPassword || null,
      name,
      website,
      type: organizationType,
      industry,
      verificationToken,
      isVerified: false,
      description,
      logoUrl,
    });

    const addedMember = await newMembers.save();

    // Create the verification URL
    const verificationUrl = `https://boepartners.com/verify?token=${verificationToken}`;

    // Send a verification email
    const mailOptions = {
      from: "info@boepartners.com",
      to: email,
      subject: "Verify Your Email",
      text: `Please click on the following link to verify your email: ${verificationUrl}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(201)
          .send({ message: "Verification email sent", member: addedMember });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "an error",
    });
  }
}

export async function verifyMember(req, res) {
  const { token } = req.query;
  try {
    if (!token) {
      res.status(400).send({
        message: "Token is required",
      });
      return;
    }

    const member = await Members.findOne({ verificationToken: token });
    if (!member) {
      return res
        .status(404)
        .send({ message: "No member found with this token" });
    }

    member.isVerified = true;
    member.verificationToken = null;
    await member.save();

    const generatedToken = jwt.sign({ id: member._id }, secretKey);

    const memberInfo = {
      name: member.name,
      website: member.website,
      industry: member.industry,
      type: "member",
      email: member.email,
      typeOf: member.type,
      token: generatedToken,
    };

    res.status(201).json(memberInfo);
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: [error.message],
    });
  }
}

export async function updateMember(req, res) {
  const member = await Members.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).send(member);
}
