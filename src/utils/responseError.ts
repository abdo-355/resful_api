import { ValidationError } from "express-validator";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

export default ResponseError;
