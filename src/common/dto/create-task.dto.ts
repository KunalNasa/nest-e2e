import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDTO {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'New Feature', description: 'Title of the task' })
  title: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({
    example: 'Implement new feature for user dashboard',
    description: 'Detailed description of the task',
  })
  description: string;
}
