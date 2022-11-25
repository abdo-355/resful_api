import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import User from "../models/user";
import ResponseError from "../utils/responseError";

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
