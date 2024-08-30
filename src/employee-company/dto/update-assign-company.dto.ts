import { AssignCompaniesDto } from './assign-companies.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateUserDto extends PartialType(AssignCompaniesDto) {}