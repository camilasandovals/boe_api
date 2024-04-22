import UserLike from "../models/userLikeSchema.js";
import mongoose from "mongoose";
import Members from "../models/schoolSchema.js";

export async function getUserLikes(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).send({ message: "User ID is required" });
      return;
    }

    const userLikes = await UserLike.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), isLiked: true } },
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programDetails",
        },
      },
      { $unwind: "$programDetails" },
      {
        $lookup: {
          from: "members",
          localField: "programDetails.school",
          foreignField: "_id",
          as: "schoolDetails",
        },
      },
      { $unwind: "$schoolDetails" },
      {
        $project: {
          Date: 1,
          programDetails: 1,
          schoolDetails: 1,
        },
      },
    ]);

    res.status(200).send(userLikes);
  } catch (error) {
    console.error("Error in getUserLikesWithDetails:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
}

export async function addLike(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(404)
        .send({ message: "You need to log in to be able to like a program" });
    }
    const { program, isLiked } = req.body;
    const programId = new mongoose.Types.ObjectId(program);

    const doc = await UserLike.findOne({ user: userId, program: programId });
    if (doc) {
      await UserLike.findByIdAndUpdate(doc._id, { isLiked: isLiked });
      res.status(200).send({ message: "Like updated" });
      return;
    } else {
      const newUserLike = new UserLike({
        user: userId,
        program: programId,
        isLiked: isLiked,
      });
      await newUserLike.save();
      res.status(201).send({ message: "Like added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding like", error: error });
  }
}

export async function getMemberLikes(req, res) {
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
    const userLikes = await UserLike.aggregate([
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programDetails",
        },
      },
      { $unwind: "$programDetails" },
      { $match: { "programDetails.school": member._id, isLiked: true } }, // Filter likes for programs of the member's school
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          Date: 1,
          programDetails: 1,
          userDetails: { email: 1, name: 1, lastName: 1, avatar: 1 }, // Include only necessary user fields
        },
      },
    ]);

    res.status(200).send(userLikes);
  } catch (error) {
    console.error("Error in getMemberLikes:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
}
