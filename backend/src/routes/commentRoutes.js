import express from "express";
import { createComment, getCommentsByHandWarmer } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getCommentsByHandWarmer);

export default router;
