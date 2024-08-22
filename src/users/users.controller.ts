import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationPipe } from '@nestjs/common';
import { ParseShortIdPipe } from '../pipes/parse-shortid.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Get()
    find(@Query('role') role?: 'ADMIN' | 'MANAGER' | 'USER') {
        if (role) {
            return this.usersService.findByRole(role);
        }
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseShortIdPipe) id: string) {
        return this.usersService.findOne(id)
    }

    @Post()
    create(@Body(ValidationPipe) CreateUserDto: CreateUserDto) {
        return this.usersService.create(CreateUserDto)
    }

    @Patch(':id')
    update(@Param('id', ParseShortIdPipe) id: string, @Body(ValidationPipe) UpdateUserDto: UpdateUserDto ) {
        return this.usersService.update(id, UpdateUserDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseShortIdPipe) id: string) {
        return this.usersService.delete(id)
    }
}
