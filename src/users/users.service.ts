import { Injectable } from '@nestjs/common';
import { generateId } from '../utils/id-generator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    private users = [
        {
            'id': "OtAYnQD6W",
            'name': 'Ira',
            'email': 'imcode@connected.com',
            'role': 'ADMIN',
            'password': '123456'
        },
        {
            'id': 'WtAYnQD6W',
            'name': 'Ben',
            'email': 'ben@connected.com',
            'role': 'USER',
            'password': '123456'
        },
        {
            'id': 'PtAYnQD6W',
            'name': 'Kate',
            'email': 'kate@connected.com',
            'role': 'MANAGER',
            'password': '123456'
        },
        {
            "id": "uepxzwvVT",
            "password": "$2b$10$Rbp5BbqlTeoT7B.i5CYLrOwyhq3ZKgvm6LPS5mb.jyPdqik6/dI2O",
            "email": "tommy@code.com",
            "name": "Tommy",
            "role": "ADMIN"
        }
    ]

    findAll() {
        return this.users
    }

    findByRole(role?: 'ADMIN' | 'MANAGER' | 'USER') {
        if (role) {
            const rolesArray = this.users.filter(user => user.role === role)

            if (rolesArray.length === 0) throw new NotFoundException('User Role Not Found')

            return rolesArray
        }

        return this.users
    }

    findOne(id: string) {
        const user = this.users.find(user => user.id === id)

        if (!user) throw new NotFoundException('User Not Found')

        return user
    }

    async create(createUserDto: CreateUserDto) {
        const { password, email, ...userData } = createUserDto;

        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: generateId(),
            password: hashedPassword,
            email,
            ...userData,
        }
        this.users.push(newUser)

        return newUser;
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        this.users = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...updateUserDto }
            }
            return user
        })

        return this.findOne(id)
    }

    delete(id: string) {
        const removeUser = this.findOne(id)

        this.users = this.users.filter(user => user.id !== id)

        return removeUser

    }


}
