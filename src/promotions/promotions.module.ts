import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CompanyModule } from 'src/company/company.module';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [DatabaseModule, CompanyModule ],
  providers: [PromotionsService],
  controllers: [PromotionsController]
})
export class PromotionsModule {}
