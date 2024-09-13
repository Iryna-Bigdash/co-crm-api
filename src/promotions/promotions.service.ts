import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as shortid from 'shortid';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(companyId: string, createDto: CreatePromotionDTO) {

        const newPromotion = await this.databaseService.promotions.create({
            data: {
                title: createDto.title,
                description: createDto.description,
                discount: createDto.discount,
                company: {
                    connect: { id: companyId },
                },
            },
        });

        return newPromotion
    }

    async findByCompanyId(companyId: string) {
        return this.databaseService.promotions.findMany({
            where: {
                companyId: companyId,
            },
            include: {
                company: {
                    select: {
                        title: true,
                    },
                },
            },
        });
    }

    async findAll() {
        const promotions = await this.databaseService.promotions.findMany({
            include: {
                company: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        return promotions.map(promotion => ({
            id: promotion.id,
            title: promotion.title,
            description: promotion.description,
            discount: promotion.discount,
            companyId: promotion.companyId,
            companyTitle: promotion.company.title,
        }));
    }


    async findOne(id: string) {
        const promotion = await this.databaseService.promotions.findUnique({
            where: { id },
        });

        if (!promotion) {
            throw new NotFoundException(`Promotion with ID ${id} not found`);
        }

        return promotion;
    }

    async update(id: string, updateDto: UpdatePromotionDTO) {
        const currentPromotion = await this.findOne(id);

        const hasChanges = Object.keys(updateDto).some(key => currentPromotion[key] !== updateDto[key]);

        if (!hasChanges) {
            return {
                message: 'No changes detected',
                promotion: currentPromotion,
            };
        }

        return this.databaseService.promotions.update({
            where: { id },
            data: updateDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.databaseService.promotions.delete({
            where: { id },
        });
    }
}
