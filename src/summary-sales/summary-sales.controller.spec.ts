import { Test, TestingModule } from '@nestjs/testing';
import { SummarySalesController } from './summary-sales.controller';

describe('SummarySalesController', () => {
  let controller: SummarySalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummarySalesController],
    }).compile();

    controller = module.get<SummarySalesController>(SummarySalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
