import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import User from "../models/user";

export const signup: RequestHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
};
