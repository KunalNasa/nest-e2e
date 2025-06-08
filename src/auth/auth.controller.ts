import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up',
    schema: { example: { accessToken: 'jwt.token.here' } },
  })
  async userSignup(@Body() dto: SignupDto) {
    return this.authService.userSignup(dto);
  }

  @Post('user/signin')
  @ApiOperation({ summary: 'User signin' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
    schema: { example: { accessToken: 'jwt.token.here' } },
  })
  async userSignin(@Body() dto: SigninDto) {
    return this.authService.userSignin(dto.email, dto.password);
  }

  @Post('admin/signup')
  @ApiOperation({ summary: 'Admin signup' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Admin successfully signed up',
    schema: { example: { accessToken: 'jwt.token.here' } },
  })
  async adminSignup(@Body() dto: SignupDto) {
    return this.authService.adminSignup(dto);
  }

  @Post('admin/signin')
  @ApiOperation({ summary: 'Admin signin' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully signed in',
    schema: { example: { accessToken: 'jwt.token.here' } },
  })
  async adminSignin(@Body() dto: SigninDto) {
    return this.authService.adminSignin(dto.email, dto.password);
  }

  // Uncomment and add JwtAuthGuard if you enable this route
  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // @ApiOperation({ summary: 'Logout current user' })
  // @ApiResponse({ status: 200, description: 'User successfully logged out' })
  // async logout(@CurrentUser('sub') userId: string) {
  //   return this.authService.logout(userId);
  // }
}
