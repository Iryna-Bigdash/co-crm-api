import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule ],
  controllers: [CountriesController],
  providers: [CountriesService],

})
export class CountriesModule {}
