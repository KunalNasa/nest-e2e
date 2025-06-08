import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from 'src/common/dto/create-task.dto';
import { JwtAuthGuard } from 'src/common/guards/JWT-auth.guard';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth() // Because JwtAuthGuard is used
@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task assigned to current user' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    schema: {
      example: {
        id: 'uuid',
        title: 'Task title',
        description: 'Task description',
        assignedToId: 'user-uuid',
        createdAt: '2025-06-08T12:34:56.789Z',
        updatedAt: '2025-06-08T12:34:56.789Z',
      },
    },
  })
  async createTask(
    @CurrentUser('id') userId: string,
    @Body() createTaskDTO: CreateTaskDTO,
  ) {
    return this.taskService.createTask(userId, createTaskDTO);
  }

  @Delete(':taskId')
  @ApiOperation({
    summary: 'Delete a task by ID, only if owned by current user',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID of the task to delete',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized to delete this task' })
  async deleteTask(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.taskService.deleteTask(userId, taskId);
  }
}
