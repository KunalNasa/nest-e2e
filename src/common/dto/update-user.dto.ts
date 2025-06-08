import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({
    example: 'strongpassword',
    description: 'User password, minimum 6 characters',
  })
  password?: string;
}
