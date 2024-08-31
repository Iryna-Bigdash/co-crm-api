import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EmployeeCompanyService } from './employee-company.service';
import { AssignCompaniesDto } from './dto/assign-companies.dto';

@Controller('employee-company')
export class EmployeeCompanyController {
  constructor(private readonly employeeCompanyService: EmployeeCompanyService) {}

  @Post()
  async assignCompaniesToEmployee(@Body() assignDto: AssignCompaniesDto) {
    return this.employeeCompanyService.assignCompanies(assignDto.employeeId, assignDto.companyIds);
  }

  @Get(':employeeId')
    async findAllCompaniesByEmployee(@Param('employeeId') employeeId: string) {
        return this.employeeCompanyService.findCompaniesByEmployee(employeeId);
    }

   @Get()  
    async findAllCompaniesWithEmployees() {
        return this.employeeCompanyService.findAllCompaniesWithEmployees();
    }  


}
