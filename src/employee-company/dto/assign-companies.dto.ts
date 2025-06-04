import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignCompaniesDto {
  @IsUUID()
  employeeId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  companyIds: string[];
}