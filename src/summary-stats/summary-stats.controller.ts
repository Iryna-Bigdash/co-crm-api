import { Controller, Get, Query } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SummaryStatsService } from './summary-stats.service';



@Controller('summary-stats')
export class SummaryStatsController {
    constructor(private readonly summaryStatsService: SummaryStatsService) { }

    @Throttle({ short: { ttl: 1000, limit: 10 } })
    @Get()
    find(@Query('employeeId') employeeId?: string) {
        return this.summaryStatsService.getSummaryStats(employeeId);
    }

}
