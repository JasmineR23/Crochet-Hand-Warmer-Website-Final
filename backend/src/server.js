import express from "express";
import cors from "cors";
import "dotenv/config";


import authRoutes from "./routes/authRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import handWarmerRoutes from "./routes/handWarmerRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

import commentRoutes from "./routes/commentRoutes.js";


const app = express();


app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    // Allow ANY localhost port
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // Otherwise block it
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());


app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/stripe", stripeRoutes);
app.use("/handwarmers", handWarmerRoutes);
app.use("/orders", ordersRoutes);
app.use("/comments", commentRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
