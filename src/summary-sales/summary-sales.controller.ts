import { Controller, Get } from '@nestjs/common';
import { SummarySalesService } from './summary-sales.service';

@Controller('summary-sales')
export class SummarySalesController {
    constructor(private readonly summarySalesService: SummarySalesService) { }


    @Get()
    find() {
        return this.summarySalesService.findAll();
    }
}
