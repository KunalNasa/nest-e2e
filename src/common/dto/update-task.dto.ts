import { IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskStatusDto {
  @IsString()
  taskId: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
