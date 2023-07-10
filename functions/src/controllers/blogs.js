import  Blogs  from "../models/blogsSchema.js";

export function getBlogs(req, res) {
    Blogs.find({})
      .then((blogs) => {
        res.status(200).send(blogs);
      })
      .catch((err) => {
        console.error(err);
      });
  }