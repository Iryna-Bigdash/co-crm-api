import { Body, Controller, Post, Get, Query, Param, ValidationPipe, NotFoundException } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';
import { CompanyService } from '../company/company.service';

//create promotion +
//get all promotions for all company +
//get promotions for company +
//get current promotion +
//update current promotion +
//delete current promotion

@Controller('promotions')
export class PromotionsController {
   constructor( private readonly promotionsService: PromotionsService ){}
   
   //create promotion
   @Post()
   async create(@Body() createDto: CreatePromotionDTO ){
    return this.promotionsService.create(createDto);
   }

//    @Get()
//    async find(@Query('title') title?: string) {
//      if (title) {
//        const company = await this.companyService.findByTitle(title);

//        if (company) {
//          return this.promotionsService.findByCompanyId(company.id);
//        }

//        throw new NotFoundException('Company not found');
//      }
     
//      return this.promotionsService.findAll();
//    }

//    @Get(':id')
//     findOne(@Param('id') id: string) {
//         return this.promotionsService.findOne(id)
//     }

//     @Patch(':id')
//     update(@Param('id') id: string, @Body(ValidationPipe) UpdatePromotionDTO: UpdatePromotionDTO ) {
//         return this.promotionsService.update(id, UpdatePromotionDTO)
//     }

//     @Delete(':id')
//     delete(@Param('id') id: string) {
//         return this.promotionsService.delete(id)
//     }

}
