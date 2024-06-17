import Messages from "../models/messagesSchema.js";
import Users from "../models/userSchema.js";
import Members from "../models/schoolSchema.js";
import mongoose from "mongoose";

export async function createMessage(req, res) {
  try {
    const { message, sender, recipient } = req.body;

    if (!message || !sender || !recipient) {
      res.status(400).send({ message: "Missing required fields" });
      return;
    }

    const recipientId = new mongoose.Types.ObjectId(recipient);
    const member = await Members.findById(recipientId);
    const user = await Users.findOne({ email: sender.toLowerCase() });
    if (!member) {
      res.status(400).send({ message: "Member not found" });
      return;
    }
    if (!user) {
      res.status(400).send({ message: "User not found" });
      return;
    }
    const newMessage = new Messages({
      message,
      sender: user._id,
      recipient: member._id,
    });
    const savedMessage = await newMessage.save();
    res.status(201).send({ message: "Message sent", savedMessage });
  }
  catch (error) {
    res.status(500
    ).send
    ({ error: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const memberId = req.user?.id; // Assuming req.user.id is the ID of the logged-in member (school)

    if (!memberId) {
      res.status(400).send({ message: "Member ID is required" });
      return;
    }

    // Verify that the member exists and fetch the school ID
    const member = await Members.findById(memberId);
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }
    
    // Fetch the user likes for programs of the school member is associated with
    const messages = await Messages.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "recipient",
          foreignField: "_id",
          as: "schoolDetails"
        }
      },
      { $unwind: "$schoolDetails" },
      { $match: { "schoolDetails._id": member._id } }, // Filter likes for programs of the member's school
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          "date": 1,
          "message": 1,
          "userDetails": { email: 1, name: 1, lastName: 1, avatarUrl: 1 }
        }
      }
    ]);

    res.status(200).send(messages);
  }
  catch (error) {
    res.status(500
    ).send
    (error);
  }
}

export async function getUserMessages(req, res) { 
  try {
    const userId = req.user?.id; 
    if (!userId) {
      res.status(400).send({ message: "User ID is required" });
      return;
    }
    const user = await Users.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const messages = await Messages.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      { $match: { "userDetails._id": user._id } },
      {
        $lookup: {
          from: "members",
          localField: "recipient",
          foreignField: "_id",
          as: "schoolDetails"
        }
      },
      { $unwind: "$schoolDetails" },
      {
        $project: {
          "date": 1,
          "message": 1,
          "schoolDetails": { name: 1, website: 1, logoUrl: 1 }
        }
      }
    ]);
    res.status(200).send(messages);

  } catch (error) {
    res.status(500
    ).send
    (error);
  }
}

