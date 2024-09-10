import { Controller, Get, Post, Body, Param, Query, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryTitle } from '@prisma/client';
import { ParseShortIdPipe } from 'src/pipes/parse-shortid.pipe';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('title') title?: CategoryTitle) {
    return this.categoriesService.findAll(title);
  }

  @Get('/with-companies')
  async getCategoriesWithCompanyCounts() {
    return this.categoriesService.getCategoriesWithCompanyCounts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseShortIdPipe) id: string, @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

    @Delete(':id')
    delete(@Param('id', ParseShortIdPipe) id: string) {
        return this.categoriesService.delete(id)
    }
}
