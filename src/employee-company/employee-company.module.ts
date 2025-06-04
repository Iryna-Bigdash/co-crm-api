import { Module } from '@nestjs/common';
import { EmployeeCompanyService } from './employee-company.service';
import { EmployeeCompanyController } from './employee-company.controller';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeCompanyController],
  providers: [EmployeeCompanyService]
})
export class EmployeeCompanyModule {}
