import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as shortid from 'shortid';
import { CreatePromotionDTO } from './dto/create-promotion.dto';

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
}
