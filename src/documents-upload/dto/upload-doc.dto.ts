import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentsDto {
  @IsNotEmpty()
  @IsString()
  companyTitle: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;
}