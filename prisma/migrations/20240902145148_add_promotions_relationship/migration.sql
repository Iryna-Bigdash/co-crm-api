-- CreateTable
CREATE TABLE "Promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotions_id_key" ON "Promotions"("id");

-- AddForeignKey
ALTER TABLE "Promotions" ADD CONSTRAINT "Promotions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
