import { Test, TestingModule } from '@nestjs/testing';
import { SummarySalesService } from './summary-sales.service';

describe('SummarySalesService', () => {
  let service: SummarySalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummarySalesService],
    }).compile();

    service = module.get<SummarySalesService>(SummarySalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
