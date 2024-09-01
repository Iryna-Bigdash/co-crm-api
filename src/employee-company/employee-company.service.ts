import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeeCompanyService {
    constructor(private readonly databaseService: DatabaseService) { }

    async assignCompanies(employeeId: string, companyIds: string[]) {
        const employee = await this.findEmployee(employeeId);
        await this.checkCompaniesExist(companyIds);
        await this.checkForDuplicateAssignments(employeeId, companyIds);

        await this.databaseService.$transaction(async (prisma) => {
            const connectData = companyIds.map((companyId) => ({
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

    //findAllCompaniesByEmployee
    async findAllCompaniesByEmployee(employeeId: string) {
        const employee = await this.findEmployee(employeeId, true);

        return employee.companies.map((empComp) => empComp.company);
    }

    //findAllEmployeesWithCompanies
    async findAllEmployeesWithCompanies() {
        const employees = await this.databaseService.employee.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                companies: {
                    select: {
                        company: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                joinedDate: true,
                            },
                        },
                    },
                },
            },
        });

        return employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            companies: employee.companies.map((empComp) => ({
                id: empComp.company.id,
                title: empComp.company.title,
                status: empComp.company.status,
                joinedDate: empComp.company.joinedDate,
            })),
        }));
    }

    //reassignCompany/update company list for manager
    async reassignCompany(employeeId: string, companyId: string) {
        const employee = await this.findEmployee(employeeId);
        const company = await this.findCompany(companyId);

        const existingAssignment =
            await this.databaseService.employeeCompany.findFirst({
                where: { companyId },
            });

        if (existingAssignment) {
            await this.databaseService.employeeCompany.delete({
                where: {
                    employeeId_companyId: {
                        employeeId: existingAssignment.employeeId,
                        companyId,
                    },
                },
            });
        }

        await this.databaseService.employeeCompany.create({
            data: {
                employeeId,
                companyId,
            },
        });

        return {
            message: `Company ${companyId} reassigned to employee ${employeeId} successfully`,
        };
    }

    //removeCompanyFromEmployee
    async removeCompanyFromEmployee(employeeId: string, companyId: string) {
        await this.findEmployee(employeeId);
        await this.findCompany(companyId);

        const assignment = await this.databaseService.employeeCompany.findUnique({
            where: {
                employeeId_companyId: {
                    employeeId,
                    companyId,
                },
            },
        });

        if (!assignment) {
            throw new NotFoundException(`Assignment of company ${companyId} to employee ${employeeId} does not exist`);
        }

        await this.databaseService.employeeCompany.delete({
            where: {
                employeeId_companyId: {
                    employeeId,
                    companyId,
                },
            },
        });

        return {
            message: `Company ${companyId} removed from employee ${employeeId} successfully`,
        };
    }

    private async findEmployee(employeeId: string, includeCompanies: boolean = false) {
        const employee = await this.databaseService.employee.findUnique({
            where: { id: employeeId },
            include: includeCompanies ? { companies: { include: { company: true } } } : undefined,
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        return employee;
    }

    private async findCompany(companyId: string) {
        const company = await this.databaseService.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }
        return company;
    }

    // Приватний метод для перевірки наявності компаній
    private async checkCompaniesExist(companyIds: string[]) {
        const companies = await this.databaseService.company.findMany({
            where: { id: { in: companyIds } },
        });
        if (companies.length !== companyIds.length) {
            throw new NotFoundException('One or more companies not found');
        }
    }

    // Приватний метод для перевірки наявності дублюючих призначень
    private async checkForDuplicateAssignments(employeeId: string, companyIds: string[]) {
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
        existingAssignments.forEach((assignment) => {
            existingCompanyAssignments.set(assignment.companyId, assignment.employeeId);
        });

        const duplicateAssignments = companyIds.filter((companyId) => {
            const assignedEmployee = existingCompanyAssignments.get(companyId);
            return assignedEmployee && assignedEmployee !== employeeId;
        });

        if (duplicateAssignments.length > 0) {
            throw new ConflictException(
                `Companies ${duplicateAssignments.join(', ')} are already assigned to other employees`,
            );
        }
    }
}
