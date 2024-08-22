import { IsEmail, IsEnum, IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/, {
        message: 'Password must be at least 6 characters long, include at least one uppercase letter, one digit, one special character, and no spaces',
    })
    password: string;

    @IsEnum(['ADMIN', 'MANAGER', 'USER'], {
        message: 'Valid role required'
    })
    role: 'ADMIN' | 'MANAGER' | 'USER';

    @IsEmail()
    @IsNotEmpty()
    email: string
}