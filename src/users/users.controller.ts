import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

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
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Post()
    create(@Body() user: { name: string, email: string, password: string, role: 'ADMIN' | 'MANAGER' | 'USER' }) {
        return this.usersService.create(user)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() userUpdate: { name?: string, email?: string, password?: string, role?: 'ADMIN' | 'MANAGER' | 'USER' }) {
        return this.usersService.update(id, userUpdate)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }
}
