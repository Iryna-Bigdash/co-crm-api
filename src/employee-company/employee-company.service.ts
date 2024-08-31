// employee-company.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class EmployeeCompanyService {
    constructor(private readonly databaseService: DatabaseService) { }

    async assignCompanies(employeeId: string, companyIds: string[]) {

        const employee = await this.databaseService.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${employeeId} not found`);
        }

        const companies = await this.databaseService.company.findMany({
            where: { id: { in: companyIds } },
        });
        if (companies.length !== companyIds.length) {
            throw new NotFoundException('One or more companies not found');
        }

        const existingAssignments = await this.databaseService.employeeCompany.findMany({
            where: {
                companyId: { in: companyIds },
            },
            select: {
                companyId: true,
                employeeId: true,
            },
        });

        const existingCompanyAssignments = new Map<string, string>();
        existingAssignments.forEach(assignment => {
            existingCompanyAssignments.set(assignment.companyId, assignment.employeeId);
        });

        const duplicateAssignments = companyIds.filter(companyId => {
            const assignedEmployee = existingCompanyAssignments.get(companyId);
            return assignedEmployee && assignedEmployee !== employeeId;
        });

        if (duplicateAssignments.length > 0) {
            throw new ConflictException(`Companies ${duplicateAssignments.join(', ')} are already assigned to other employees`);
        }

        await this.databaseService.$transaction(async (prisma) => {
            const connectData = companyIds.map(companyId => ({
                employeeId,
                companyId,
            }));

            for (const data of connectData) {
                await prisma.employeeCompany.create({
                    data,
                });
            }
        });

        return { message: 'Companies assigned successfully' };
    }


    async findCompaniesByEmployee(employeeId: string) {
        const employee = await this.databaseService.employee.findUnique({
            where: { id: employeeId },
            include: {
                companies: {
                    include: {
                        company: true,
                    },
                },
            },
        });

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${employeeId} not found`);
        }

        return employee.companies.map(empComp => empComp.company);
    }

    async findAllCompaniesWithEmployees() {
        return this.databaseService.company.findMany({
            select: {
                id: true,
                title: true,
                status: true,
                joinedDate: true,
                employees: {
                    select: {
                        employee: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        }).then(companies =>
            companies.map(company => ({
                id: company.id,
                title: company.title,
                status: company.status,
                joinedDate: company.joinedDate,
                employees: company.employees.map(empComp => ({
                    id: empComp.employee.id,
                    name: empComp.employee.name,
                    email: empComp.employee.email,
                })),
            })),
        );
    }


}

