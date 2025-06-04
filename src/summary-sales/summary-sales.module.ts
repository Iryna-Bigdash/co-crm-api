import { Module } from '@nestjs/common';
import { SummarySalesController } from './summary-sales.controller';
import { SummarySalesService } from './summary-sales.service';

@Module({
  controllers: [SummarySalesController],
  providers: [SummarySalesService]
})
export class SummarySalesModule {}
