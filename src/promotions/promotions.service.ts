import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as shortid from 'shortid';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(createPromotionDTO: CreatePromotionDTO) {
        const { companyId, ...promotionData } = createPromotionDTO;
        const id = shortid.generate();

        const newPromotion: Prisma.PromotionsCreateInput = {
            id,
            ...promotionData,
            company: {
                connect: { id: companyId },
            },
        };

        return await this.databaseService.promotions.create({
            data: newPromotion,
        });
    }

    async findByCompanyId(companyId: string) {
        return this.databaseService.promotions.findMany({
            where: { companyId },
        });
    }

    async findAll() {
        return this.databaseService.promotions.findMany();
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
