/*
  Warnings:

  - You are about to drop the column `categoryTitle` on the `Company` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryTitle" AS ENUM ('IT', 'Finance', 'Manufacturing', 'Trade', 'Services', 'Healthcare', 'Construction', 'Prodact', 'Tourism', 'Health', 'Media', 'Energy');

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "categoryTitle";

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "title" "CategoryTitle" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
