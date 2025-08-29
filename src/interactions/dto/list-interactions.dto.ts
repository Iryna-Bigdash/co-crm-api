import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InteractionStatus, InteractionType } from '@prisma/client';

export class ListInteractionsDto {
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @IsOptional()
  @IsEnum(InteractionStatus)
  status?: InteractionStatus;

  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @IsOptional()
  @IsISO8601()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number) @IsInt() @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number) @IsInt() @Min(1)
  take?: number = 20;
}
