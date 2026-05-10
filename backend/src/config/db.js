import { PrismaClient } from "@prisma/client";
import "dotenv/config";

console.log(" USING DB FILE:", import.meta.url);
console.log(" DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

export default prisma;
