import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Post from "../models/post";

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

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed, entered data is incorrect",
        errors: errors.array(),
      });
    }

    const post = new Post({
      title,
      content,
      imgUrl: "this is an image url",
      creator: { name: "Abdo" },
    });

    const result = await post.save();

    res.status(201).json({
      message: "Post saved successfully",
      post: result,
    });
  } catch (err) {
    console.log(err);
  }
};
