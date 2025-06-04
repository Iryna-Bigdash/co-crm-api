import { IsUUID, IsString, IsNotEmpty, IsBoolean, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Category } from '@prisma/client';

export enum CompanyStatus {
  Active = 'active',
  NotActive = 'notActive',
  Pending = 'pending',
  Suspended = 'suspended',
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(CompanyStatus, {
    message: 'Status must be one of: active, notActive, pending, suspended',
  })
  @IsNotEmpty()
  status: CompanyStatus;

  @IsDateString()
  joinedDate: string ;

  @IsBoolean()
  @IsOptional()
  hasPromotions?: boolean;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
  
  @IsString()
  @IsNotEmpty()
  countryId: string;
}
