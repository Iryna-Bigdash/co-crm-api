import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Prisma, CompanyStatus } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { CreateCompanyDto } from './dto/company-create.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  private readonly logger = new MyLoggerService(CompanyController.name);

  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @SkipThrottle({ default: false })
  @Get()
  findAll(@Ip() ip: string, @Query('status') status?: CompanyStatus) {
    this.logger.log(`Request for ALL Companies from IP: ${ip}`, CompanyController.name);
    return this.companyService.findAll(status);
  }

  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: Prisma.CompanyUpdateInput) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Throttle({ long: { ttl: 60000, limit: 50 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
