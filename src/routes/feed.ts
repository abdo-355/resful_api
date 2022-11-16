import express from "express";
import * as feedController from "../controllers/feed";

const router = express.Router();

router.get("/posts", feedController.getPosts);

export default router;
