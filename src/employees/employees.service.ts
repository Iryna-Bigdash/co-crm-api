import { BadRequestException, NotFoundException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  private toEmployeeResponse(employee: {
    id: string;
    name: string;
    email: string;
    password: string;
    plainPassword: string | null;
    role: string;
    createdAt: Date;
    updatedAT: Date;
  }) {
    const { password: _hash, plainPassword: _plain, ...rest } = employee;
    return rest;
  }

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    const { email, name, password, plainPassword: _plain, ...employeeData } = createEmployeeDto;

    if (typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }

    await this.validateEmail(email);
    this.validatePassword(password);
    await this.validateUniqueFields(email, name);

    const id = shortid.generate();
    const hashedPassword = await this.hashPassword(password);

    const employee = await this.databaseService.employee.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword,
        plainPassword: password,
        ...employeeData,
      },
    });

    return this.toEmployeeResponse(employee);
  }

  async findAll(role?: 'ADMIN' | 'USER' | 'MANAGER') {
    const employees = await this.databaseService.employee.findMany({
      where: role ? { role } : undefined,
    });

    return employees.map((employee) => this.toEmployeeResponse(employee));
  }

  async findOne(id: string) {
    await this.ensureEmployeeExists(id);

    const employee = await this.databaseService.employee.findUnique({
      where: { id },
    });

    return this.toEmployeeResponse(employee!);
  }

  async update(id: string, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    await this.ensureEmployeeExists(id);

    const data: Prisma.EmployeeUpdateInput = { ...updateEmployeeDto };

    if (data.password && typeof data.password === 'string') {
      const plainPassword = data.password;
      this.validatePassword(plainPassword);
      data.plainPassword = plainPassword;
      data.password = await this.hashPassword(plainPassword);
    }

    if (data.plainPassword !== undefined) {
      delete data.plainPassword;
    }

    if (updateEmployeeDto.email && typeof updateEmployeeDto.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(updateEmployeeDto.email)) {
        throw new BadRequestException('Invalid email format.');
      }

      const existingEmployeeByEmail = await this.databaseService.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmployeeByEmail && existingEmployeeByEmail.id !== id) {
        throw new BadRequestException('User with this email already exists');
      }
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
      data,
    }).then((employee) => this.toEmployeeResponse(employee));
  }

  async remove(id: string) {
    await this.ensureEmployeeExists(id);

    const employee = await this.databaseService.employee.delete({
      where: { id },
    });

    return this.toEmployeeResponse(employee);
  }

  async validateCredentials({ email, password }: { email: string; password: string }) {
    const employee = await this.databaseService.employee.findUnique({ where: { email } });
    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return { 
      id: employee.id, 
      name: employee.name, 
      email: employee.email, 
      role: employee.role 
    };
  }

  async assignCompany(employeeId: string, companyId: string) {
    await this.ensureEmployeeExists(employeeId);
    
    const employee = await this.databaseService.employee.findUnique({ where: { id: employeeId } });
    if (employee.role !== 'MANAGER') {
      throw new BadRequestException('Only managers can be assigned companies');
    }

    const existingAssignment = await this.databaseService.employeeCompany.findUnique({
      where: { employeeId_companyId: { employeeId, companyId } }
    });

    if (existingAssignment) {
      throw new BadRequestException('Company already assigned to this manager');
    }
    
    return this.databaseService.employeeCompany.create({
      data: { employeeId, companyId }
    });
  }

  async unassignCompany(employeeId: string, companyId: string) {
    await this.ensureEmployeeExists(employeeId);

    return this.databaseService.employeeCompany.delete({
      where: { employeeId_companyId: { employeeId, companyId } }
    });
  }

  async getAssignedCompanies(employeeId: string) {
    await this.ensureEmployeeExists(employeeId);

    const assignments = await this.databaseService.employeeCompany.findMany({
      where: { employeeId },
      include: { 
        company: { 
          include: { 
            category: true, 
            country: true 
          } 
        } 
      }
    });
    
    return assignments.map(a => ({
      id: a.company.id,
      title: a.company.title,
      description: a.company.description,
      status: a.company.status,
      joinedDate: a.company.joinedDate,
      hasPromotions: a.company.hasPromotions,
      avatar: a.company.avatar,
      categoryId: a.company.categoryId,
      categoryTitle: a.company.category.title,
      countryId: a.company.countryId,
      countryTitle: a.company.country.name,
      createdAt: a.company.createdAt,
      updatedAT: a.company.updatedAT,
    }));
  }
}
