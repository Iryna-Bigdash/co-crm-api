import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { CompanyModule } from './company/company.module';
import { EmployeeCompanyModule } from './employee-company/employee-company.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    UsersModule,
    CompanyModule, 
    DatabaseModule, 
    EmployeesModule, 
    EmployeeCompanyModule,
    PromotionsModule,
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 10
    },
    {
      name: 'long',
      ttl: 60000,
      limit: 50
    },
  ]), MyLoggerModule, CategoriesModule, CountriesModule ],
  controllers: [AppController, CategoriesController],
  providers: [AppService, {
    provide:APP_GUARD,
    useClass:ThrottlerGuard
  }, CategoriesService],
})
export class AppModule {}
