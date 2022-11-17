import { RequestHandler } from "express";

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "post title", content: "post content" }],
  });
};

export const createPost: RequestHandler = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  console.log(title, content);
  // TODO: Create post in the db
  res.status(201).json({
    message: "Post saved successfully",
    post: { id: new Date().toISOString(), title, content },
  });
};
