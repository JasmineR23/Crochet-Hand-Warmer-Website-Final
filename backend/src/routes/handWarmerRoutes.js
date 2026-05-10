import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createHandWarmer,
  getAllHandWarmers,
  getHandWarmerById,
  deleteHandWarmer
} from "../controllers/handWarmerController.js";

const router = express.Router();

router.post("/", upload.single("image"), createHandWarmer);
router.get("/", getAllHandWarmers);
router.get("/:id", getHandWarmerById);
router.delete("/:id", deleteHandWarmer);




export default router;
