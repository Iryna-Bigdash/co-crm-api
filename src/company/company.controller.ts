import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip, NotFoundException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Prisma, CompanyStatus } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { CreateCompanyDto } from './dto/company-create.dto';
import { UploadService } from 'src/upload-photos/upload-photos.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly uploadService: UploadService
  ) { }

  private readonly logger = new MyLoggerService(CompanyController.name);

  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.companyService.create(createCompanyDto, employeeId);
  }

  @SkipThrottle({ default: false })
  @Get()
  findAll(
    @Ip() ip: string, 
    @Query('status') status?: CompanyStatus,
    @Query('employeeId') employeeId?: string,
  ) {
    this.logger.log(`Request for ALL Companies from IP: ${ip}`, CompanyController.name);
    return this.companyService.findAll(status, employeeId);
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
  async remove(@Param('id') id: string) {
    const company = await this.companyService.findOne(id); // або findById(id)

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    if (company.avatar) {
      try {
        await this.uploadService.removeAvatar(company.avatar); // ← видалення файлу
      } catch (e) {
        console.warn('⚠️ File was not removed', { error: e.message });
      }
    }

    return this.companyService.remove(id);
  }
}
