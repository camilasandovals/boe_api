import UserLike from "../models/userLikeSchema.js";

export async function addLike(req, res) {
    const {user , school} = req.body

    if (!user || !school) {
      if (!user) {
        res.redirect("/login");
      }
      return null; 
    }
  
    const query = {
      school_id: school.id,
      user_id: user.id,
    };
  
    const userLike = await UserLike.findOne(query);
    const isLiked = userLike ? !userLike.is_liked : true;
  
    const userLikeData = {
      user_id: user.id,
      school_id: school.id,
      is_liked: isLiked,
    };
  
    const options = { upsert: true };
    await UserLike.findOneAndUpdate(query, userLikeData, options);
    res.redirect("back");
  }