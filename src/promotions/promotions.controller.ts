import { Body, Controller, Post, Get, Query, Param, ValidationPipe, NotFoundException, Patch, Delete } from '@nestjs/common';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';
import { CompanyService } from '../company/company.service';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
    constructor(
        private readonly promotionsService: PromotionsService,
        private readonly companyService: CompanyService
    ) { }

    @Post()
    async create(@Body() createDto: CreatePromotionDTO) {
        return this.promotionsService.create(createDto);
    }

    @Get()
    async find(@Query('title') title?: string) {
        if (title) {
            const company = await this.companyService.findByTitle(title);

            if (company) {
                return this.promotionsService.findByCompanyId(company.id);
            }

            throw new NotFoundException('Company not found');
        }

        return this.promotionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const promotion = await this.promotionsService.findOne(id);

        if (!promotion) {
            throw new NotFoundException('Promotion not found');
        }

        return promotion;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: UpdatePromotionDTO) {
        const data = this.promotionsService.update(id, updateDto);

        return data;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.promotionsService.remove(id);

        return { message: 'Promotion removed successfully' };
    }
}
