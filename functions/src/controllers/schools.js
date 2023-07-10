import  School  from "../models/schoolSchema.js";

export async function getSchools(req, res) {
    const schools = await School.find().sort({ name: 1, _id: 1 });
    res.status(200).send(schools)
  }