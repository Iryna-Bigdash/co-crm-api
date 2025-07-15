import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentsDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  companyTitle: string;

  @IsOptional()
  @IsString()
  documentName?: string;
}