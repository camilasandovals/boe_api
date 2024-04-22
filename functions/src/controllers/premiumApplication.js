import PremiumApplication from "../models/premiumApplicationSchema.js";
import mongoose from "mongoose";
import Members from "../models/schoolSchema.js";

export async function addPremiumApplication(req, res) {
    try {
      const userId = req.user?.id;
      const {programId} = req.body;
      const resume = req.file; 

      if (!userId) {
        res.status(400).send({ message: "User ID is required" });
        return;
      }

      if (!programId) {
        res.status(400).send({ message: "Program ID is required" });
        return;
      }

      if (!resume) {
        res.status(400).send({ message: "Resume file is required" });
        return;
      }

      const doc = await PremiumApplication.findOne({ user: userId, program: programId });
      if (doc) {
        return res.status(401).send({message: "You already applied to this program"});
      }

      const newApplicant = new PremiumApplication({
        user: userId,
        program: programId,
        resumePath: resume.path,
      });

      await newApplicant.save();
      return res.status(201).send({message: "You successfully applied to this program!"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: error.message,
          message: "An error occurred",
        });
    }
}

export async function getPremiumApplication (req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).send({ message: "User ID is required" });
        return;
      }

      const applications = await PremiumApplication.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "programs",
            localField: "program",
            foreignField: "_id",
            as: "programDetails"
          }
        },
        { $unwind: "$programDetails" },
        {
          $lookup: {
            from: "members",
            localField: "programDetails.school",
            foreignField: "_id",
            as: "schoolDetails"
          }
        },
        { $unwind: "$schoolDetails" },
        {
          $project: {
            "date": 1,
            "programDetails": 1,
            "schoolDetails": 1,
          }
        }
      ]);
      res.status(200).send(applications);
    } catch (error) {
      console.error("Error in getPremiumApplication:", error);
      res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

export async function getMemberApplications(req, res) {
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
    const applications = await PremiumApplication.aggregate([
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programDetails"
        }
      },
      { $unwind: "$programDetails" },
      { $match: { "programDetails.school": member._id } }, // Filter likes for programs of the member's school
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          "date": 1,
          "resumePath": 1,
          "programDetails": 1,
          "userDetails": { email: 1, name: 1, lastName: 1, avatar: 1 }
        }
      }
    ]);

    res.status(200).send(applications);
  } catch (error) {
    console.error("Error in getMemberLikes:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
}