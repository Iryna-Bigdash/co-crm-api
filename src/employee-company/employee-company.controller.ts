import { Controller, Post, Body } from '@nestjs/common';
import { EmployeeCompanyService } from './employee-company.service';
import { AssignCompaniesDto } from './dto/assign-companies.dto';

@Controller('employee-company')
export class EmployeeCompanyController {
  constructor(private readonly employeeCompanyService: EmployeeCompanyService) {}

  @Post()
  async assignCompaniesToEmployee(@Body() assignDto: AssignCompaniesDto) {
    return this.employeeCompanyService.assignCompanies(assignDto.employeeId, assignDto.companyIds);
  }
}
