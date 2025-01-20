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
      subject: "Verify Your Email - Welcome to BOE Partners!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #437e58;">Welcome to BOE Partners!</h2>
            <p style="color: #000;">Hi ${name},</p>
            <p style="color: #000;">Thank you for signing up. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p style="color: #000;">Or copy and paste the following URL into your browser:</p>
            <p style="color: #000; word-break: break-all;">${verificationUrl}</p>
            <p style="color: #000;">If you did not sign up for BOE Partners, please ignore this email.</p>
            <p style="color: #000;">Best regards,</p>
            <p style="color: #000;">The BOE Partners Team</p>
          </div>
        </div>
      `,
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

    const adminMailOptions = {
      from: "info@boepartners.com",
      to: "info@boepartners.com", 
      subject: "New User Signed Up",
      text: `A new user has signed up with the following details:
      Name: ${name}
      Email: ${email}
      Website: ${website}
      Organization Type: ${organizationType}
      Industry: ${industry}
      Description: ${description}
      Logo URL: ${logoUrl}`
    };

    transporter.sendMail(adminMailOptions, function (error, info) {
      if (error) {
        console.log("Error sending admin email: ", error);
      } else {
        console.log("Admin email sent: " + info.response);
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
      bio: member.description,
      avatarUrl: member.logoUrl,
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
