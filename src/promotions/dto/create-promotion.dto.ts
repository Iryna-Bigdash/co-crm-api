
import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromotionDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @IsNotEmpty()
    discount: number;

    @IsString() 
    @IsNotEmpty()
    companyId: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}