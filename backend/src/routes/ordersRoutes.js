import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);


    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


    for (const item of order.items) {
      await prisma.handWarmer.update({
        where: { id: item.itemId },
        data: {
          quantity: {
            increment: item.quantity_placed
          }
        }
      });
    }


    await prisma.order.delete({
      where: { id }
    });

    res.json({ success: true, message: "Order canceled and inventory restored" });

  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});

export default router;
