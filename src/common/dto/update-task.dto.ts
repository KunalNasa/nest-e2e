import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskStatusDto {
  @IsString()
  @ApiProperty({
    example: 'f7c4d0a2-9e3b-4a52-9c51-7f7f9e0c1234',
    description: 'Task UUID',
  })
  taskId: string;

  @IsEnum(TaskStatus)
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'New status for the task',
  })
  status: TaskStatus;
}
