import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  companyTitle: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;
}
