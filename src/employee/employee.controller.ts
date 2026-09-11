import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly empService: EmployeeService) {}

  @Post()
  async createEmp(@Body() data: Partial<Employee>): Promise<Employee> {
    return this.empService.create(data);
  }

  @Get()
  async getAllEmps(): Promise<Employee[]> {
    return this.empService.findAll();
  }

  @Get(':id')
  async getEmpById(@Param('id') id: number): Promise<Employee> {
    return this.empService.findEmpById(id);
  }

  @Put(':id')
  async updateEmp(
    @Param('id') id: number,
    @Body() data: Partial<Employee>,
  ): Promise<Employee> {
    return this.empService.updateEmp(Number(id), data);
  }

  @Delete(':id')
  async deleteEmp(@Param('id') id: number): Promise<{ message: string }> {
    return this.empService.delete(id);
  }
}
