import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Post from "../models/post";

export interface ResponseError extends Error {
  statusCode?: number;
}

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({ message: "fetched posts successfully", posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      const error: ResponseError = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "post fetched", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error: ResponseError = new Error(
        "Validation failed, entered data is incorrect"
      );
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error: ResponseError = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }

    const imgUrl = req.file.path.replace("\\", "/");
    console.log(req.file.path);
    console.log(imgUrl);

    const post = new Post({
      title,
      content,
      imgUrl,
      creator: { name: "Abdo" },
    });

    const result = await post.save();

    res.status(201).json({
      message: "Post saved successfully",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
