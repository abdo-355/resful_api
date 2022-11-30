import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";

import ResponseError from "./utils/responseError";
import testResolver from "./graphql/resolvers/testResolver";
import userResolver from "./graphql/resolvers/userResolver";

const app = express();
dotenv.config();

// to save the user Id later
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

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
    const data = err.data;
    res.status(status).json({ message, data });
  }
);

const main = async () => {
  try {
    const schema = await buildSchema({
      resolvers: [testResolver, userResolver],
    });

    app.use(
      "/graphql",
      graphqlHTTP({
        schema,
        graphiql: true,
        customFormatErrorFn(err) {
          if (!err.originalError) {
            return err;
          }

          const error = err.originalError as ResponseError;

          const data = error.data;
          const message = err.message;
          const code = error.statusCode;

          return { message, status: code, data };
        },
      })
    );

    await mongoose.connect(process.env.MONGO_URI!);

    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
};

main();
