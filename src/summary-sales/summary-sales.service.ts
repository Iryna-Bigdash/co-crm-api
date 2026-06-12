import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SummarySalesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private sales = [
    {
      id: 'OtAYnQD6W',
      companyId: 'PtAYnQD6W',
      companyTitle: 'Spain',
      sold: 12,
      income: 3450,
    },
    {
      id: 'OtAYnQD6Y',
      companyId: 'a4ra0MFdx',
      companyTitle: 'Switzerland',
      sold: 980,
      income: 52672,
    },
    {
      "id": "1tAYnQD6Y",
      "companyId": "b4ra0MFdx",
      "companyTitle": "Italy",
      "sold": 3,
      "income": 2175
    }
  ];

  async findAll(employeeId?: string) {
    if (!employeeId) {
      return this.sales;
    }

    // Get list of company IDs assigned to this manager
    const assignments = await this.databaseService.employeeCompany.findMany({
      where: { employeeId },
      select: { companyId: true }
    });

    const companyIds = assignments.map(a => a.companyId);

    // Filter sales data by assigned companies
    return this.sales.filter(sale => companyIds.includes(sale.companyId));
  }
}
