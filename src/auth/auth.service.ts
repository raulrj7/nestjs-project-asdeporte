import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

export interface RegisterResponse {
  message: string;
  userId: number;
}

export interface LoginResponse {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  public async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async register(createUserDto: CreateUserDto): Promise<RegisterResponse> {
    const email = createUserDto.email.toLowerCase();

    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const email = loginUserDto.email.toLowerCase();
  
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const jwtSecret = this.configService.get('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET is not defined in the environment variables');
    }
  
    const token = this.jwtService.sign({ userId: user.id }, { secret: jwtSecret });
    return { accessToken: token };
  }
  
}
