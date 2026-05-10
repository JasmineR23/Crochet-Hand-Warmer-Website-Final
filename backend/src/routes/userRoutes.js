import express from "express";
import multer from "multer";
import prisma from "../config/db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });


router.post("/profile-image", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    const filename = req.file.filename;

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: filename }
    });

    res.json({ profileImage: filename });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
