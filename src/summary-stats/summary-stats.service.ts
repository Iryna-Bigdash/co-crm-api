import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SummaryStatsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getSummaryStats(employeeId?: string) {
        // Build company filter for managers
        const companyWhere: any = {};
        if (employeeId) {
            companyWhere.employees = {
                some: { employeeId }
            };
        }

        // For promotions - only count promotions for assigned companies
        const promotionsCount = employeeId 
            ? await this.databaseService.promotions.count({
                where: {
                    company: {
                        employees: {
                            some: { employeeId }
                        }
                    }
                }
            })
            : await this.databaseService.promotions.count();

        // For categories - only count categories that have assigned companies
        const categoriesCount = employeeId
            ? await this.databaseService.category.count({
                where: {
                    companies: {
                        some: {
                            employees: {
                                some: { employeeId }
                            }
                        }
                    }
                }
            })
            : await this.databaseService.category.count();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const newCompaniesCount = await this.databaseService.company.count({
            where: {
                ...companyWhere,
                joinedDate: {
                    gte: startOfMonth,
                },
            },
        });

        const activeCompaniesCount = await this.databaseService.company.count({
            where: {
                ...companyWhere,
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
