import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const requireAuth = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header or cookies
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 4. Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Not authorized." });
  }
};

export default requireAuth;
