import { RequestHandler } from "express";
import { validationResult } from "express-validator";

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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect",
        errors: errors.array(),
      });
  }

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
