import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret_key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto = { email: 'test@domain.com', password: 'password' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
      });

      const result = await authService.register(createUserDto);
      expect(result).toEqual({
        message: 'User registered successfully',
        userId: 1,
      });
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = { email: 'test@domain.com', password: 'password' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: 'hashed_password',
      });

      await expect(authService.register(createUserDto)).rejects.toThrowError(
        new ConflictException('Email is already registered'),
      );
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const loginUserDto = { email: 'test@domain.com', password: 'password' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginUserDto.email,
        password: await bcrypt.hash(loginUserDto.password, 10),
      });

      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await authService.login(loginUserDto);
      expect(result).toEqual({ accessToken: 'jwt_token' });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto = { email: 'test@domain.com', password: 'wrong_password' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginUserDto.email,
        password: await bcrypt.hash('correct_password', 10),
      });

      await expect(authService.login(loginUserDto)).rejects.toThrowError(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });
});
