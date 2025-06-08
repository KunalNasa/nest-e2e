import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findSelf(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateSelf(userId: string, dto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prismaService.user.findFirst({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    return { message: 'Profile updated successfully' };
  }

  async getUserTasks(userId: string) {
    const tasks = await this.prismaService.task.findMany({
      where: { assignedToId: userId },
    });

    return tasks;
  }

  async updateTaskStatus(taskId: string, userId: string, status: TaskStatus) {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException('Task not found');
    if (task.assignedToId !== userId)
      throw new BadRequestException('You can only update your own tasks');

    const updatedTask = await this.prismaService.task.update({
      where: { id: taskId },
      data: { status },
    });

    return updatedTask;
  }
}
