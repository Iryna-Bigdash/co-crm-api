import { Module } from '@nestjs/common';
import { SummarySalesController } from './summary-sales.controller';
import { SummarySalesService } from './summary-sales.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SummarySalesController],
  providers: [SummarySalesService]
})
export class SummarySalesModule {}
