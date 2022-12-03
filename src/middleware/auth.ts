import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import ResponseError from "../utils/responseError";

config();

interface IToken {
  email: string;
  userId: string;
}

const auth: RequestHandler = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET!);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.userId = (decodedToken as IToken).userId;
  req.isAuth = true;
  next();
};

export default auth;
