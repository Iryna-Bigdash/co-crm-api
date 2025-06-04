import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SummaryStatsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getSummaryStats() {
        const promotionsCount = await this.databaseService.promotions.count();
        const categoriesCount = await this.databaseService.category.count();
        const newCompaniesCount = await this.databaseService.company.count({
            where: {
                joinedDate: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                },
            },
        });
        const activeCompaniesCount = await this.databaseService.company.count({
            where: {
                status: 'active',
            },
        });

        return {
            promotions: promotionsCount,
            categories: categoriesCount,
            newCompanies: newCompaniesCount,
            activeCompanies: activeCompaniesCount,
        };
    }


}
