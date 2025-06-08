import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTaskDTO } from 'src/common/dto/create-task.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/JWT-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/Decorators/Roles.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // only admins can access these routes
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Post('users/:userId/tasks')
  @ApiOperation({ summary: 'Create a new task for a user' })
  @ApiParam({ name: 'userId', description: 'UUID of the user' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTaskForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    return this.adminService.createTaskForUser(userId, createTaskDTO);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks' })
  async getAllTasks() {
    return this.adminService.getAllTasks();
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'userId', description: 'UUID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Patch('users/:userId/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'userId', description: 'UUID of the user' })
  @ApiBody({ schema: { example: { role: 'ADMIN' } } }) // simple inline schema for role update
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body('role') role: Role,
  ) {
    return this.adminService.updateUserRole(userId, role);
  }
}
