import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth/supabase-auth.guard';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly empService: EmployeeService) {}

  @Post()
  async createEmp(@Body() data: Partial<Employee>): Promise<Employee> {
    return this.empService.create(data);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async getAllEmps(): Promise<Employee[]> {
    return this.empService.findAll();
  }

  @Get('search')
  async searchEmps(
    @Query('name') name: string,
    @Query('department') department: string,
  ): Promise<Employee[]> {
    return this.empService.search({ name, department });
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
