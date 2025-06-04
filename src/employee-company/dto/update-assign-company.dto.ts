import { IsUUID } from 'class-validator';

export class UpdateAssignCompanyDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  companyId: string;
}