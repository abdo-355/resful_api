import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";

import feedRoutes from "./routes/feed";
import { ResponseError } from "./controllers/feed";

const app = express();
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.${file.originalname.split(".")[1]}`);
  },
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage, fileFilter }).single("image"));
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
