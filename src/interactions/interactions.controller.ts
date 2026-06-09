import {
    Controller, Post, Get, Patch, Delete,
    Param, Body, Query, UsePipes, ValidationPipe
  } from '@nestjs/common';
  import { InteractionsService } from './interactions.service';
  import { CreateInteractionDto } from './dto/create-interaction.dto';
  import { UpdateInteractionDto } from './dto/update-interaction.dto';
  import { ListInteractionsDto } from './dto/list-interactions.dto';
  
  @Controller('interactions')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  export class InteractionsController {
    constructor(private readonly service: InteractionsService) {}
  
 
    @Post('company/:companyId')
    create(
      @Param('companyId') companyId: string,
      @Body() dto: CreateInteractionDto,
    ) {
      return this.service.create(companyId, dto);
    }
  
    /** отримати всі interactions */
    @Get()
    findAll() {
      return this.service.findAll();
    }

    @Get('company/:companyId')
    findByCompany(
      @Param('companyId') companyId: string,
      @Query() q: ListInteractionsDto,
    ) {
      return this.service.findByCompany(companyId, q);
    }
  
    /** отримати один interaction */
    @Get('/:id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    /** оновити interaction */
    @Patch('/:id')
    update(@Param('id') id: string, @Body() dto: UpdateInteractionDto) {
      return this.service.update(id, dto);
    }
  
    /** видалити interaction */
    @Delete('/:id')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  