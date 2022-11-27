import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";

import Post from "../models/post";
import User from "../models/user";
import ResponseError from "../utils/responseError";
import { io } from "../app";

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const currentPage = +req.query.page! || 1;
    const perPage = 2;

    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip(perPage * (currentPage - 1))
      .limit(perPage);

    res
      .status(200)
      .json({ message: "fetched posts successfully", posts, totalItems });
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

    const post = new Post({
      title,
      content,
      imgUrl,
      creator: req.userId,
    });

    const result = await post.save();

    const user = await User.findById(req.userId);

    if (!user) {
      const error: ResponseError = new Error("User doesn't exist");
      error.statusCode = 401;
      throw error;
    }

    user.posts!.push(post._id);
    await user.save();

    io.emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: result,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error: ResponseError = new Error(
        "Validation failed, entered data is incorrect"
      );
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imgUrl = req.body.image;

    if (req.file) {
      imgUrl = req.file.path.replace("\\", "/");
    }

    if (!imgUrl) {
      const error: ResponseError = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postId);

    if (!post) {
      const error: ResponseError = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }

    if (req.userId !== post.creator.toString()) {
      const error: ResponseError = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (imgUrl !== post.imgUrl) {
      clearImage(post.imgUrl);
    }

    post.title = title;
    post.content = content;
    post.imgUrl = imgUrl;
    const result = await post.save();

    res
      .status(200)
      .json({ message: "Post updated successfully", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      const error: ResponseError = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    if (req.userId !== post.creator.toString()) {
      const error: ResponseError = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imgUrl);

    await Post.findByIdAndRemove(postId);

    await User.findOneAndUpdate(
      { _id: req.userId },
      { $pull: { posts: postId } }
    );

    res.status(202).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to delete image from our local storage
const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "..", "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
