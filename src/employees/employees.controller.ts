import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma, Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { Public } from 'src/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';


@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  private readonly logger = new MyLoggerService(EmployeesController.name)

  @Throttle({ short: {ttl: 1000, limit: 10}})
  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Public()
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.employeesService.validateCredentials(loginDto);
  }

  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: Role) {
    this.logger.log(`Request for ALL Employees\t${ip}`, EmployeesController.name)
    return this.employeesService.findAll(role);
  }

  @Throttle({ short: {ttl: 1000, limit: 10}})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Throttle({ short: {ttl: 1000, limit: 10}})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.employeesService.update(id, updateEmployeeDto);
  }
  
  @Throttle({ long: {ttl: 60000, limit: 50}})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Post(':employeeId/companies/:companyId')
  async assignCompany(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.employeesService.assignCompany(employeeId, companyId);
  }

  @Delete(':employeeId/companies/:companyId')
  async unassignCompany(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.employeesService.unassignCompany(employeeId, companyId);
  }

  @Get(':employeeId/companies')
  async getAssignedCompanies(@Param('employeeId') employeeId: string) {
    return this.employeesService.getAssignedCompanies(employeeId);
  }
}
