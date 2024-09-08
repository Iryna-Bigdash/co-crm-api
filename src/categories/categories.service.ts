// import { Injectable } from '@nestjs/common';
// import { Category } from '@prisma/client';


// @Injectable()
// export class CategoriesService {
//     private readonly categories = Object.values(Category);

//     findAll(): Category[] {
//         return this.categories;
//     }
// }

import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client'; // або '@prisma/client' залежно від вашого шляху

@Injectable()
export class CategoriesService {
  // Метод для отримання всіх категорій
  getAllCategories(title?: Category): { id: string; title: Category }[] {
    // Повертає всі значення enum як масив об'єктів
    return Object.values(Category).map(category => ({
      id: category,
      title: category,
    }));
  }
}
