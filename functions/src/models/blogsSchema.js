import { mongoose } from "mongoose";

const BlogSchema = new mongoose.Schema({
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
});

const BlogsModel = mongoose.model("resources_blogposts", BlogSchema);

export default BlogsModel
