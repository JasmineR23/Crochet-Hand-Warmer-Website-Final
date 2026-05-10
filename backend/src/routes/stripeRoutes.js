import express from "express";
import Stripe from "stripe";
import prisma from "../config/db.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items, shipping, userId } = req.body;


    const amount = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0) * 100;

  
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { userId },
    });


    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("PaymentIntent error:", err);
    res.status(500).json({ message: "PaymentIntent failed" });
  }
});


router.post("/save-order", async (req, res) => {
  try {
    const { userId, items, total, shipping, paymentIntentId } = req.body;


    const order = await prisma.order.create({
      data: {
        userId,
        items,
        total,
        shipping,
        paymentIntentId,
      },
    });


    for (const item of items) {
      await prisma.handWarmer.update({
        where: { id: item.itemId },
        data: {
          quantity: {
            decrement: item.quantity_placed,
          },
        },
      });
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("Order saving error:", err);
    res.status(500).json({ message: "Order saving failed" });
  }
});

export default router;
