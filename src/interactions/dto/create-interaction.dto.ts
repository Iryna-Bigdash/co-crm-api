import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { InteractionStatus, InteractionType } from '@prisma/client';

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;

  @IsEnum(InteractionStatus)
  status: InteractionStatus;

  @IsISO8601()
  date: string;

  @IsString()
  comment: string;

  @IsOptional()
  @IsISO8601()
  nextCall?: string;

  @IsOptional()
  @Type(() => Number)
  amount?: number;
}
