import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async getAllCountries() {
    return this.databaseService.country.findMany();
  }

  async getCountryIdByName(name: string): Promise<string | null> {
    const country = await this.databaseService.country.findUnique({
      where: { name },
    });

    return country ? country.id : null;
  }

  async getCountriesWithCompanyCounts() {
    return this.databaseService.country.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        _count: {
          select: { companies: true }
        },
      },
    });
  }
}
