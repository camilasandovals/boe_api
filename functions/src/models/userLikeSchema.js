import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserLikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  isLiked: {
    type: Boolean,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const UserLikeModel = model("UserLike", UserLikeSchema);

export default UserLikeModel
