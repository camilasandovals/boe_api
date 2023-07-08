import UserLike from "../models/userLikeSchema.js";

export async function getUserLikes(req, res) {
    const { user } = req.query;
  
    try {
      const likes = await UserLike.find({ user: user.toLowerCase() });
      res.status(200).send(likes);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error fetching user likes", error: error });
    }
  }

  
export async function addLike(req, res) {
    const {user , school, program, is_liked} = req.body
    
    try {
        const doc = await UserLike.findOne({ user: user.toLowerCase(), program: program, school:school })
        if (doc) {
            const filter = { user: user.toLowerCase(), program: program, school:school }
            const update = { $set: req.body };
            const options = { returnOriginal: false };
            const updatedUser = await UserLike.findOneAndUpdate(filter, update, options);
            if (updatedUser) {
                res.send(updatedUser);
            } else {
                res.status(404).send({ message: "You need to be logged in." });
            }
        }
    
    else {
        const userLikeData = new UserLike({
        user: user,
        school: school,
        program: program,
        is_liked: is_liked,
        });
        const addUser = await userLikeData.save();
        res.status(201).send(addUser);
        }
        
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: "Error with userlikes", error: error });
    }
  }