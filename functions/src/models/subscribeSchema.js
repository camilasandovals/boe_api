import { mongoose } from "mongoose"

const subscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true
  }
});

const Subscriber = mongoose.model("Subscriber", subscribeSchema);

export default Subscriber
