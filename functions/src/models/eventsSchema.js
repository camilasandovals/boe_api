import { mongoose } from "mongoose";

const EventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const EventsModel = mongoose.model("resources_events", EventsSchema);

export default EventsModel
