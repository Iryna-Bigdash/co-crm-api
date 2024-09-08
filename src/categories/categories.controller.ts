// import { Controller, Get, Ip } from '@nestjs/common';
// import { Throttle, SkipThrottle } from '@nestjs/throttler';
// import { CategoriesService } from './categories.service';
// import { MyLoggerService } from 'src/my-logger/my-logger.service';
// import { Category } from '@prisma/client';

// @SkipThrottle()
// @Controller('categories')
// export class CategoriesController {
//     constructor(private readonly categoriesService: CategoriesService) {}
//     private readonly logger = new MyLoggerService(CategoriesController.name);

//     @Throttle({ short: { ttl: 1000, limit: 10 } })
//     @Get()
//     async findAll(@Ip() ip: string): Promise<Category[]> {
//         this.logger.log(`Request for ALL Categories\t${ip}`, CategoriesController.name);
//         return this.categoriesService.findAll();
//     }
// }

import { Controller, Get, Ip } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CategoriesService } from './categories.service';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  private readonly logger = new MyLoggerService(CategoriesController.name);

  @Throttle({ short: { ttl: 1000, limit: 10 } })
  @Get()
  async findAll(@Ip() ip: string){
    this.logger.log(`Request for ALL Categories\t${ip}`, CategoriesController.name);
    return this.categoriesService.getAllCategories();
  }
}

