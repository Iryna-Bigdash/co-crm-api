import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeCompanyService } from './employee-company.service';

describe('EmployeeCompanyService', () => {
  let service: EmployeeCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeCompanyService],
    }).compile();

    service = module.get<EmployeeCompanyService>(EmployeeCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
