import { Test, TestingModule } from '@nestjs/testing';
import { SummaryStatsService } from './summary-stats.service';

describe('SummaryStatsService', () => {
  let service: SummaryStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummaryStatsService],
    }).compile();

    service = module.get<SummaryStatsService>(SummaryStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
