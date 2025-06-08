import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';
import { TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/JWT-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/Decorators/Roles.decorator';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned successfully.',
  })
  async getSelf(@CurrentUser('sub') userId: string) {
    return this.userService.findSelf(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  async updateSelf(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateSelf(userId, dto);
  }

  @Get('me/tasks')
  @ApiOperation({ summary: 'Get tasks assigned to current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user tasks returned successfully.',
  })
  async getMyTasks(@CurrentUser('sub') userId: string) {
    return this.userService.getUserTasks(userId);
  }

  @Patch('me/tasks/:taskId/status')
  @ApiOperation({ summary: 'Update status of a specific task' })
  @ApiParam({ name: 'taskId', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      properties: {
        status: { type: 'string', enum: Object.values(TaskStatus) },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully.',
  })
  async updateTaskStatus(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @CurrentUser('sub') userId: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.userService.updateTaskStatus(taskId, userId, status);
  }
}
