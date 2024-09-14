import { Test, TestingModule } from '@nestjs/testing';
import { SummaryStatsController } from './summary-stats.controller';

describe('SummaryStatsController', () => {
  let controller: SummaryStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryStatsController],
    }).compile();

    controller = module.get<SummaryStatsController>(SummaryStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
