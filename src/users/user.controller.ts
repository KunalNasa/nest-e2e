import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';
import { TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/JWT-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/Decorators/Roles.decorator';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER') // ensure only users can access these routes
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getSelf(@CurrentUser('id') userId: string) {
    return this.userService.findSelf(userId);
  }

  @Patch('me')
  async updateSelf(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateSelf(userId, dto);
  }

  @Get('me/tasks')
  async getMyTasks(@CurrentUser('id') userId: string) {
    return this.userService.getUserTasks(userId);
  }

  @Patch('me/tasks/:taskId/status')
  async updateTaskStatus(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @CurrentUser('id') userId: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.userService.updateTaskStatus(taskId, userId, status);
  }
}
