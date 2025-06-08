import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDTO } from 'src/common/dto/create-task.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async createTask(userId: string, createTaskDTO: CreateTaskDTO) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return await this.prismaService.task.create({
      data: {
        assignedToId: userId,
        ...createTaskDTO,
      },
    });
  }
  async deleteTask(userId: string, taskId: string) {
    const task = await this.prismaService.task.findFirst({
      where: {
        assignedToId: userId,
        id: taskId,
      },
    });
    if (!task) {
      throw new UnauthorizedException(
        'You are not allowed to delete other users tasks',
      );
    }
  }
}
