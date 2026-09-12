import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  async create(empData: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepo.create(empData);
    return this.employeeRepo.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find();
  }

  async findEmpById(id: number): Promise<Employee> {
    const emp = await this.employeeRepo.findOneBy({ id });
    if (!emp) {
      throw new NotFoundException(`employee not found with this ${id}`);
    }
    return emp;
  }

  async updateEmp(
    id: number,
    updatedData: Partial<Employee>,
  ): Promise<Employee> {
    const emp = await this.employeeRepo.findOneBy({ id });
    if (!emp) {
      throw new NotFoundException('Employee not found with this id!');
    }

    const updated = Object.assign(emp, updatedData);
    return this.employeeRepo.save(updated);
  }

  async delete(id: number): Promise<{ message: string }> {
    const emp = await this.employeeRepo.delete(id);
    if (emp.affected === 0) {
      throw new NotFoundException(`Employee with id ${id} not found!`);
    }
    return {
      message: `employee with id ${id} has been deleted successfully!`,
    };
  }

  async search(filters: {
    name?: string;
    department?: string;
  }): Promise<Employee[]> {
    const query = this.employeeRepo.createQueryBuilder('employee');
    if (filters.name) {
      query.andWhere('employee.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.department) {
      query.andWhere('employee.department = :dept', {
        dept: filters.department,
      });
    }
    
    return query.getMany();
  }
}
