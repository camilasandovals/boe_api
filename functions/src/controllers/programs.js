import Programs from "../models/programsSchema.js";
import mongoose from 'mongoose';

export async function getProgramsWithSchools(req, res) {
  try {
    const userId = req.user?.id;
    let pipeline = [
      {
        $lookup: {
          from: "members",
          localField: "school",
          foreignField: "_id",
          as: "school"
        }
      },
      {
        $unwind: "$school"
      }
    ];

    // Check if userId is provided and is a valid ObjectId string
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
      pipeline = pipeline.concat([
        {
          $lookup: {
            from: "userlikes",
            let: { programId: "$_id", userId: objectIdUserId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$program", "$$programId"] },
                      { $eq: ["$user", "$$userId"] }
                    ]
                  }
                }
              },
              {
                $project: { _id: 0, isLiked: "$isLiked" }
              }
            ],
            as: "userLike"
          }
        },
        {
          $unwind: {
            path: "$userLike",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            isLiked: { $ifNull: ["$userLike.isLiked", false] }
          }
        }
      ]);
    } else {
      pipeline.push({
        $addFields: {
          isLiked: false
        }
      });
    }

    pipeline.push({
      $project: {
        "description": 1,
        "school": 1,
        "name": 1,
        "duration": 1,
        "cost": 1,
        "financing": 1,
        "school": 1,
        "isLiked": 1
      }
    });

    const programsWithSchools = await Programs.aggregate(pipeline);
    res.status(200).send(programsWithSchools);
  } catch (error) {
    console.error("Error in getProgramsWithSchools:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
}

export async function addProgramsWithSchools (req, res) {
  try {
    const schoolId = req.user?.id
    if (!schoolId) {
      res.status(404).send({message: "Please log out and log in"})
      return
    }
    const {name, description, duration, cost, financing, location  } = req.body

    const newProgram = new Programs({
      name,
      description, 
      duration, 
      cost,
      financing,
      location, 
      school: schoolId
    })

    const savedProgram = await newProgram.save()

    res.status(201).send({message: "Program added successfully", program: savedProgram, success: true})

  } catch (error) {
    console.error("Error adding program", error);
    res.status(500).send({message: "An error occured, please try again. If the error persists contact us", error: error.message})
  }
}
