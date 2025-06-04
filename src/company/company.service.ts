import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma, CompanyStatus } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCompanyDto } from './dto/company-create.dto'

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
  
  private async ensureCountryExists(id: string): Promise<void> {
    const selectCountry = await this.databaseService.country.findUnique({
      where: { id },
    }
    );

    if (!selectCountry) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
  }

  private async ensureCategoryExists(id: string): Promise<void> {
    const selectCategory = await this.databaseService.category.findUnique({
      where: { id },
    }
    );


    if (!selectCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }



  async create(createCompanyDto: CreateCompanyDto) {
    const { categoryId, countryId, ...companyData } = createCompanyDto;

    await this.ensureCountryExists(countryId);
    await this.ensureCategoryExists(categoryId);

    const id = shortid.generate();

    const newCompany = {
      id,
      ...companyData,
      country: {
        connect: { id: countryId },
      },
      category: {
        connect: { id: categoryId },
      },
    };

    return this.databaseService.company.create({
      data: newCompany,
    });
  }



  // async findAll(status?: CompanyStatus) {
  //   return this.databaseService.company.findMany({
  //     where: status ? { status } : undefined,
  //   });
  // }

  // async findOne(id: string) {
  //   await this.ensureCompanyExists(id);

  //   return this.databaseService.company.findUnique({
  //     where: { id },
  //   });
  // }

  async findAll(status?: CompanyStatus) {

    const companies = await this.databaseService.company.findMany({
      where: { status },
      include: {
        category: {
          select: {
            title: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
    });
  
    return companies.map(company => ({
      id: company.id,
      title: company.title,
      description: company.description,
      status: company.status,
      joinedDate: company.joinedDate,
      hasPromotions: company.hasPromotions,
      avatar: company.avatar,
      categoryId: company.categoryId,
      categoryTitle: company.category.title,
      countryId: company.countryId,
      countryTitle: company.country.name,
      createdAt: company.createdAt,
      updatedAT: company.updatedAT,
    }));
  }
  
  
  async findOne(id: string) {
    const company = await this.databaseService.company.findUnique({
      where: { id },
      include: {
        category: true,
        country: true,
      },
    });
  
    if (!company) {
      throw new Error('Company not found');
    }
  
    return {
      id: company.id,
      title: company.title,
      description: company.description,
      status: company.status,
      joinedDate: company.joinedDate,
      hasPromotions: company.hasPromotions,
      avatar: company.avatar,
      categoryId: company.categoryId,
      categoryTitle: company.category.title,
      countryId: company.countryId,
      countryTitle: company.country.name,
      createdAt: company.createdAt,
      updatedAT: company.updatedAT,
    };
  }
  
  

  async findByTitle(title: string) {
    const companies = await this.databaseService.company.findMany({
      where: { title: { contains: title, mode: 'insensitive' } },
      include: {
        category: {
          select: {
            title: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
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
