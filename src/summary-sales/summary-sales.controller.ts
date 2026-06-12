import { Controller, Get, Query } from '@nestjs/common';
import { SummarySalesService } from './summary-sales.service';

@Controller('summary-sales')
export class SummarySalesController {
    constructor(private readonly summarySalesService: SummarySalesService) { }


    @Get()
    find(@Query('employeeId') employeeId?: string) {
        return this.summarySalesService.findAll(employeeId);
    }
}
