import mongoose from "mongoose";

const { Schema, model } = mongoose;

const premiumApplicationSchema = new Schema({
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
  resumePath: {
    type: String,
    required: [true, "Resume file is required"]
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const PremiumApplication = mongoose.model("PremiumApplication", premiumApplicationSchema);

export default PremiumApplication;
