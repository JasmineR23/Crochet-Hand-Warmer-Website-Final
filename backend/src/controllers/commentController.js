import prisma from "../config/db.js";


export const createComment = async (req, res) => {
  try {
    const { content, userId, handWarmerId } = req.body;

    if (!content || !userId || !handWarmerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: Number(userId),
        handWarmerId: Number(handWarmerId),
      },
      include: {
        user: true,         
        handWarmer: true,   
      },
    });

    res.json(comment);
  } catch (err) {
    console.error(" Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};


export const getCommentsByHandWarmer = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await prisma.comment.findMany({
      where: { handWarmerId: Number(id) },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
