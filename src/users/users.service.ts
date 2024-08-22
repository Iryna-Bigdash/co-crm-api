import { Injectable } from '@nestjs/common';
import { generateId } from '../utils/id-generator';

@Injectable()
export class UsersService {
    private users = [
        {
            'id': "a1",
            'name': 'Ira',
            'email': 'imcode@connected.com,',
            'role': 'ADMIN',
            'password': '123456'
        },
        {
            'id': 'a2',
            'name': 'Ben',
            'email': 'ben@connected.com,',
            'role': 'USER',
            'password': '123456'
        },
        {
            'id': 'a3',
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
            return this.users.filter(user => user.role === role)
        }

        return this.users
    }

    findOne(id: string) {
        const user = this.users.find(user => user.id === id)

        return user
    }

    create(user: { name: string, email: string, password: string, role: 'ADMIN' | 'MANAGER' | 'USER' }) {
        const newUser = {
            id: generateId(),
            ...user,
        }
        this.users.push(newUser)

        return newUser;
    }

    update(id: string, updateUser: { name?: string, email?: string, password?: string, role?: 'ADMIN' | 'MANAGER' | 'USER' }) {
        this.users = this.users.map(user => {
            if (user.id === id) {
            return { ...user, ...updateUser }
        }
        return user
        })

       return this.findOne(id) 
    }

    delete(id: string){
        const removeUser = this.findOne(id)

        this.users = this.users.filter(user => user.id !== id)

        return removeUser

    }


}
