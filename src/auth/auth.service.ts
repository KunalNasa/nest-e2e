import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface SignupDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  // Generic signup
  async signup(data: SignupDto, role: Role) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role,
      },
    });

    return this.generateToken(user);
  }

  // Generic signin
  async signin(email: string, password: string, role: Role) {
    const user = await this.prisma.user.findFirst({
      where: { email, role },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await this.validatePassword(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  // User convenience methods
  async userSignup(data: SignupDto) {
    return this.signup(data, Role.USER);
  }

  async adminSignup(data: SignupDto) {
    return this.signup(data, Role.ADMIN);
  }

  async userSignin(email: string, password: string) {
    return this.signin(email, password, Role.USER);
  }

  async adminSignin(email: string, password: string) {
    return this.signin(email, password, Role.ADMIN);
  }

  // Logout (optional, for JWT usually client just deletes token)
  //   async logout(userId: string) {
  //     // Could implement token blacklist if needed
  //     return { message: 'Logged out successfully' };
  //   }
}
