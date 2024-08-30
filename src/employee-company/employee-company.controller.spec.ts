import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeCompanyController } from './employee-company.controller';

describe('EmployeeCompanyController', () => {
  let controller: EmployeeCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeCompanyController],
    }).compile();

    controller = module.get<EmployeeCompanyController>(EmployeeCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
