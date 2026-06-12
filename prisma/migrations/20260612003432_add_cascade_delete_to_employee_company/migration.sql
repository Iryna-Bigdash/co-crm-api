-- DropForeignKey
ALTER TABLE "EmployeeCompany" DROP CONSTRAINT "EmployeeCompany_companyId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeCompany" DROP CONSTRAINT "EmployeeCompany_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "EmployeeCompany" ADD CONSTRAINT "EmployeeCompany_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeCompany" ADD CONSTRAINT "EmployeeCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
