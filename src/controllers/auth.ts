import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/user";
import ResponseError from "../utils/responseError";

dotenv.config();

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error: ResponseError = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({ name, email, password: hashedPw });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error: ResponseError = new Error("No such user exists");
      error.statusCode = 400;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error: ResponseError = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

export const getUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error: ResponseError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateUserStatus: RequestHandler = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error: ResponseError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
