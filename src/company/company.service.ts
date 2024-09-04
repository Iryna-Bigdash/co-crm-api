import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma, CompanyStatus } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as shortid from 'shortid';

@Injectable()
export class CompanyService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async ensureCompanyExists(id: string): Promise<void> {
    const selectCompany = await this.databaseService.company.findUnique({
      where: { id },
    });

    if (!selectCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }

  async create(createCompanyDto: Prisma.CompanyCreateInput) {
    const { ...companyData } = createCompanyDto;
    const id = shortid.generate();

    const newCompany = {
      id,
      ...companyData,
    };

    return this.databaseService.company.create({
      data: newCompany,
    });
  }

  async findAll(status?: CompanyStatus) {
    return this.databaseService.company.findMany({
      where: status ? { status } : undefined,
    });
  }

  async findOne(id: string) {
    await this.ensureCompanyExists(id);

    return this.databaseService.company.findUnique({
      where: { id },
    });
  }

  async findByTitle(title: string) {
    const companies = await this.databaseService.company.findMany({
      where: { title },
    });

    return companies.length ? companies[0] : null;
  }

  async update(id: string, updateCompanyDto: Prisma.CompanyUpdateInput) {
    await this.ensureCompanyExists(id);

    return this.databaseService.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    await this.ensureCompanyExists(id);

    return this.databaseService.company.delete({
      where: { id },
    });
  }
}
