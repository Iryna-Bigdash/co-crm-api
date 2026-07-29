import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { InteractionStatus, InteractionType } from '@prisma/client';

export class CalendarInteractionsDto {
  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @IsOptional()
  @IsISO8601()
  dateTo?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @IsOptional()
  @IsEnum(InteractionStatus)
  status?: InteractionStatus;
}
