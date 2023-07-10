import { mongoose } from "mongoose"

const UserLikeSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  is_liked: {
    type: Boolean,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const UserLikeModel = mongoose.model("UserLike", UserLikeSchema);

export default UserLikeModel
