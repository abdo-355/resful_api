import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import ResponseError from "../utils/responseError";

config();

interface tokenInterface {
  email: string;
  userId: string;
}

const isAuth: RequestHandler = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    const error: ResponseError = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET!);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error: ResponseError = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = (decodedToken as tokenInterface).userId;
  next();
};

export default isAuth;
