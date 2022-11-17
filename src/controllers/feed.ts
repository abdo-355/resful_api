import { RequestHandler } from "express";
import { addAbortSignal } from "stream";

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "12345qwerty",
        title: "post title",
        content: "post content",
        imageUrl: "images/BMW.jpg",
        creator: {
          name: "Abdo",
        },
        createdAt: new Date(),
      },
    ],
  });
};

export const createPost: RequestHandler = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  console.log(title, content);
  // TODO: Create post in the db
  res.status(201).json({
    message: "Post saved successfully",
    post: {
      id: new Date().toISOString(),
      title,
      content,
      creator: { name: "Abdo" },
      createdAt: new Date(),
    },
  });
};
