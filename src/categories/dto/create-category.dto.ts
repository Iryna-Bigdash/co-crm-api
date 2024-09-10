import { CategoryTitle } from '@prisma/client';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class CreateCategoryDto {
    @IsEnum(CategoryTitle, {
        message: 'Title must be one of the predefined CategoryTitles',
      })
      @IsNotEmpty()
      title: CategoryTitle;
    }
