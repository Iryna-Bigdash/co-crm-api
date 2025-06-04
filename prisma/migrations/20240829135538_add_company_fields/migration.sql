-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('active', 'notActive', 'pending', 'suspended');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CompanyStatus" NOT NULL,
    "joinedDate" TIMESTAMP(3) NOT NULL,
    "hasPromotions" BOOLEAN NOT NULL,
    "avatar" TEXT,
    "categoryId" TEXT NOT NULL,
    "categoryTitle" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "countryTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeCompany" (
    "employeeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "EmployeeCompany_pkey" PRIMARY KEY ("employeeId","companyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_title_key" ON "Company"("title");

-- AddForeignKey
ALTER TABLE "EmployeeCompany" ADD CONSTRAINT "EmployeeCompany_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeCompany" ADD CONSTRAINT "EmployeeCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
