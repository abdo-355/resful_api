import express from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feed";

const app = express();

app.use(bodyParser.json());

app.use("/feed", feedRoutes);

app.listen(8080);
