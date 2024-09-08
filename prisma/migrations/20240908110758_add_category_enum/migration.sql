/*
  Warnings:

  - Changed the type of `categoryTitle` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IT', 'Finance', 'Manufacturing', 'Trade', 'Services', 'Healthcare', 'Construction', 'Prodact', 'Tourism', 'Health', 'Media', 'Energy');

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "categoryTitle",
ADD COLUMN     "categoryTitle" "Category" NOT NULL;
