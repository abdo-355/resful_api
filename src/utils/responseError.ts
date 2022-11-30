import { ValidationError } from "express-validator";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[] | { message: string }[];
}

export default ResponseError;
