import UserLike from "../models/userLikeSchema.js";

export async function addLike(req, res) {
    // try {
    const {user , school, program, is_liked} = req.body
  
    // const query = {
    //   school_id: school.id,
    //   user_id: user.id,
    // };
  
    // const userLike = await UserLike.findOne(query);
    // const isLiked = userLike ? !userLike.is_liked : true;
  
    const userLikeData = new UserLike({
      user: user,
      school: school,
      program: program,
      is_liked: is_liked,
    });
    const addUser = await userLikeData.save();
    res.status(201).send(addUser);
    // const options = { upsert: true };
    // await UserLike.findOneAndUpdate(query, userLikeData, options);
    
  }