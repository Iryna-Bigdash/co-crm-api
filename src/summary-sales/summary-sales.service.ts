import { Injectable } from '@nestjs/common';

@Injectable()
export class SummarySalesService {
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
  ];

  findAll() {
    return this.sales;
  }
}
