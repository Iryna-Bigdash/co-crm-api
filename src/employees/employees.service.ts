import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as shortid from 'shortid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private readonly databaseService: DatabaseService) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private validatePassword(password: string): void {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must be at least 6 characters long, include at least one uppercase letter, one digit, one special character, and no spaces',
      );
    }
  }

  private async validateEmail(email: string): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const existingEmployee = await this.databaseService.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new BadRequestException('User with this email already exists');
    }
  }

  private async validateUniqueFields(email: string, name: string): Promise<void> {
    const [existingEmployeeByEmail, existingEmployeeByName] = await Promise.all([
      this.databaseService.employee.findUnique({ where: { email } }),
      this.databaseService.employee.findUnique({ where: { name } }),
    ]);

    if (existingEmployeeByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    if (existingEmployeeByName) {
      throw new BadRequestException('User with this name already exists');
    }
  }

  private async ensureEmployeeExists(id: string): Promise<void> {
    const employee = await this.databaseService.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    const { email, name, password, ...employeeData } = createEmployeeDto;

    await this.validateEmail(email);
    this.validatePassword(password);
    await this.validateUniqueFields(email, name);

    const id = shortid.generate();
    const hashedPassword = await this.hashPassword(password);

    const newEmployee: Prisma.EmployeeCreateInput = {
      id,
      name,
      email,
      password: hashedPassword,
      ...employeeData,
    };

    return this.databaseService.employee.create({
      data: newEmployee,
    });
  }

  async findAll(role?: 'ADMIN' | 'USER' | 'MANAGER') {
    return this.databaseService.employee.findMany({
      where: role ? { role } : undefined,
    });
  }

  async findOne(id: string) {
    await this.ensureEmployeeExists(id);

    return this.databaseService.employee.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    await this.ensureEmployeeExists(id);

    if (updateEmployeeDto.password && typeof updateEmployeeDto.password === 'string') {
      this.validatePassword(updateEmployeeDto.password);
      updateEmployeeDto.password = await this.hashPassword(updateEmployeeDto.password);
    }

    if (updateEmployeeDto.email && typeof updateEmployeeDto.email === 'string') {
      await this.validateEmail(updateEmployeeDto.email);
    }

    if (updateEmployeeDto.name && typeof updateEmployeeDto.name === 'string') {
      const existingEmployeeByName = await this.databaseService.employee.findUnique({
        where: { name: updateEmployeeDto.name },
      });

      if (existingEmployeeByName && existingEmployeeByName.id !== id) {
        throw new BadRequestException('User with this name already exists');
      }
    }

    return this.databaseService.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    await this.ensureEmployeeExists(id);

    return this.databaseService.employee.delete({
      where: { id },
    });
  }
}
