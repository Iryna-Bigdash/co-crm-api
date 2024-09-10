import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, CategoryTitle } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as shortid from 'shortid';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async ensureCategoryExists(title: CategoryTitle): Promise<void> {
    const selectCategory = await this.databaseService.category.findUnique({
      where: { title },
    });

    if (selectCategory) {
      throw new BadRequestException(`Category with title "${title}" already exists.`);
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { title } = createCategoryDto;
  
    await this.ensureCategoryExists(title);
  
    const id = shortid.generate();
  
    return this.databaseService.category.create({
      data: {
        id,
        title,
      },
    });
  }

  async findAll(title?: CategoryTitle) {
    if (title) {
      return this.databaseService.category.findMany({
        where: { title },
      });
    }
    
    return this.databaseService.category.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { title } = updateCategoryDto;
  
    if (title) {
      await this.ensureCategoryExists(title);
    }

    return this.databaseService.category.update({
      where: { id },
      data: {
        ...(title && { title }),
      },
    });
  }

  async delete(id: string) {
    await this.databaseService.category.delete({
      where: { id },
    });
  
    return {
      message: "Category deleted successfully",
    };
  }

  async getCategoriesWithCompanyCounts() {

    const groupedCompanies = await this.databaseService.company.groupBy({
      by: ['categoryId'],
      _count: {
        categoryId: true,
      },
      orderBy: {
        _count: {
          categoryId: 'desc',
        },
      },
    });

 
    const categoryIds = groupedCompanies.map((group) => group.categoryId);
    const categories = await this.databaseService.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });


    return groupedCompanies.map((group) => {
      const category = categories.find((cat) => cat.id === group.categoryId);
      return {
        id: group.categoryId,
        title: category ? category.title : 'Unknown Category',
        count: group._count.categoryId,
      };
    });
  }
  
}
