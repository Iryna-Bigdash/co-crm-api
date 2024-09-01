import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { EmployeeCompanyService } from './employee-company.service';
import { AssignCompaniesDto } from './dto/assign-companies.dto';
import { UpdateAssignCompanyDto } from './dto/update-assign-company.dto';

// призначити одну або декілька компаній конкретному менеджеру
// отримання всіх компаній разом із призначеними за ними менеджерами
// отримання всіх компаній для данного менеджера
// перевизначення компанії іншому менеджеру
// видалення призначенної компанії для співробітника

@Controller('employee-company')
export class EmployeeCompanyController {
    constructor(
        private readonly employeeCompanyService: EmployeeCompanyService,
    ) { }

    @Post()
    async assignCompaniesToEmployee(@Body() assignDto: AssignCompaniesDto) {
        return this.employeeCompanyService.assignCompanies(
            assignDto.employeeId,
            assignDto.companyIds,
        );
    }

    @Get(':employeeId')
    async findAllCompaniesByEmployee(@Param('employeeId') employeeId: string) {
        return this.employeeCompanyService.findAllCompaniesByEmployee(employeeId);
    }

    @Get()
    async findAllEmployeesWithCompanies() {
        return this.employeeCompanyService.findAllEmployeesWithCompanies();
    }

    @Patch(':employeeId/company/:companyId')
    async updateCompaniesForEmployee(
        @Param('employeeId') employeeId: string,
        @Param('companyId') companyId: string,
        @Body() updateDto: UpdateAssignCompanyDto,
    ) {
        return this.employeeCompanyService.reassignCompany(employeeId, companyId);
    }

    @Delete(':employeeId/company/:companyId')
    async removeCompanyFromEmployee(
        @Param('employeeId') employeeId: string,
        @Param('companyId') companyId: string,
    ) {
        return this.employeeCompanyService.removeCompanyFromEmployee(
            employeeId,
            companyId,
        );
    }
}
