import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      isAuth: boolean;
      userId: string;
    }
  }
}

export interface Context {
  req: Request;
  res: Respons;
}
