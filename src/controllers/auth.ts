import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import User from "../models/user";
import ResponseError from "../utils/responseError";

export const signup: RequestHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: ResponseError = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};
