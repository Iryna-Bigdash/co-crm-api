// employee-company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

    const connectData = companyIds.map(companyId => ({
      employeeId,
      companyId,
    }));

    for (const data of connectData) {
      await this.databaseService.employeeCompany.upsert({
        where: {
          employeeId_companyId: {
            employeeId: data.employeeId,
            companyId: data.companyId,
          },
        },
        update: {}, 
        create: data,
      });
    }

    return { message: 'Companies assigned successfully' };
  }
}

