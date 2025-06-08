import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateTaskDTO } from 'src/common/dto/create-task.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllUsers() {
    return await this.prismaService.user.findMany();
  }

  async createTaskForUser(userId: string, createTaskDTO: CreateTaskDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.prismaService.task.create({
      data: {
        assignedToId: userId,
        ...createTaskDTO,
      },
    });
  }

  async getAllTasks() {
    return await this.prismaService.task.findMany();
  }

  async deleteUser(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return await this.prismaService.user.delete({ where: { id } });
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === role)
      throw new BadRequestException('User already has this role');

    return await this.prismaService.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
