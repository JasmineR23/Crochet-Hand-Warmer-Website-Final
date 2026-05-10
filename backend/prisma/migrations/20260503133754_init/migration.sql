-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandWarmerPlaced" (
    "id" SERIAL NOT NULL,
    "quantityPlaced" INTEGER NOT NULL,
    "userId" INTEGER,
    "handWarmerId" INTEGER,

    CONSTRAINT "HandWarmerPlaced_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandWarmer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ordered" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HandWarmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandWarmerMaterial" (
    "id" SERIAL NOT NULL,
    "colour" TEXT NOT NULL,
    "handWarmerId" INTEGER,

    CONSTRAINT "HandWarmerMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialDistribution" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,
    "percent" TEXT NOT NULL,
    "materialId" INTEGER,

    CONSTRAINT "MaterialDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "shipping" JSONB NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "HandWarmerPlaced" ADD CONSTRAINT "HandWarmerPlaced_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandWarmerPlaced" ADD CONSTRAINT "HandWarmerPlaced_handWarmerId_fkey" FOREIGN KEY ("handWarmerId") REFERENCES "HandWarmer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandWarmerMaterial" ADD CONSTRAINT "HandWarmerMaterial_handWarmerId_fkey" FOREIGN KEY ("handWarmerId") REFERENCES "HandWarmer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDistribution" ADD CONSTRAINT "MaterialDistribution_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "HandWarmerMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;
