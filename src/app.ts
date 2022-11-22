import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import feedRoutes from "./routes/feed";
import { ResponseError } from "./controllers/feed";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use(
  (
    err: ResponseError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({ message });
  }
);

mongoose
  .connect(process.env.MONGO_URI!)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
