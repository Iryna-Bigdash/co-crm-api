import { Injectable } from '@nestjs/common';
import { generateId } from '../utils/id-generator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UsersService {
    private users = [
        {
            'id': "OtAYnQD6W",
            'name': 'Ira',
            'email': 'imcode@connected.com,',
            'role': 'ADMIN',
            'password': '123456'
        },
        {
            'id': 'WtAYnQD6W',
            'name': 'Ben',
            'email': 'ben@connected.com,',
            'role': 'USER',
            'password': '123456'
        },
        {
            'id': 'PtAYnQD6W',
            'name': 'Kate',
            'email': 'kate@connected.com,',
            'role': 'MANAGER',
            'password': '123456'
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

    create(createUserDto: CreateUserDto) {
        const newUser = {
            id: generateId(),
            ...createUserDto,
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
