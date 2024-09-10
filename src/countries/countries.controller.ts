import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';


@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Get()
  async getAllCountries() {
    return this.countriesService.getAllCountries();
  }

  @Get('/with-companies')
  async getCountriesWithCompanyCounts() {
    return this.countriesService.getCountriesWithCompanyCounts();
  }
}