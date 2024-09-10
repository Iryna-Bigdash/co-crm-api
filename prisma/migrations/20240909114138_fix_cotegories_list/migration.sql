/*
  Warnings:

  - The values [Prodact,Health] on the enum `CategoryTitle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryTitle_new" AS ENUM ('IT', 'Finance', 'Manufacturing', 'Trade', 'Services', 'Healthcare', 'Construction', 'Product', 'Tourism', 'Media', 'Energy');
ALTER TABLE "Category" ALTER COLUMN "title" TYPE "CategoryTitle_new" USING ("title"::text::"CategoryTitle_new");
ALTER TYPE "CategoryTitle" RENAME TO "CategoryTitle_old";
ALTER TYPE "CategoryTitle_new" RENAME TO "CategoryTitle";
DROP TYPE "CategoryTitle_old";
COMMIT;
