import { Module } from '@nestjs/common';
import { SummaryStatsService } from './summary-stats.service';
import { SummaryStatsController } from './summary-stats.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SummaryStatsService],
  controllers: [SummaryStatsController]
})
export class SummaryStatsModule {}
