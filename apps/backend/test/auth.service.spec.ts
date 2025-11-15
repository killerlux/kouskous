import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    phone_e164: '+21612345678',
    role: 'client' as const,
    display_name: undefined,
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByPhone: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'test';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyPhone', () => {
    it('should log OTP request', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');
      await service.verifyPhone('+21612345678');
      expect(logSpy).toHaveBeenCalledWith('OTP request for +21612345678');
    });
  });

  describe('exchangeToken', () => {
    it('should create new user and return tokens for valid test OTP', async () => {
      usersService.findByPhone.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.exchangeToken('+21612345678', '000000');

      expect(usersService.findByPhone).toHaveBeenCalledWith('+21612345678');
      expect(usersService.create).toHaveBeenCalledWith({
        phone_e164: '+21612345678',
        role: 'client',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 900,
      });
    });

    it('should return tokens for existing user with valid test OTP', async () => {
      usersService.findByPhone.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.exchangeToken('+21612345678', '000000');

      expect(usersService.findByPhone).toHaveBeenCalledWith('+21612345678');
      expect(usersService.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 900,
      });
    });

    it('should reject invalid OTP in test mode', async () => {
      await expect(
        service.exchangeToken('+21612345678', '123456'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should include correct payload in JWT', async () => {
      usersService.findByPhone.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('token');

      await service.exchangeToken('+21612345678', '000000');

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          phone_e164: mockUser.phone_e164,
          role: mockUser.role,
        },
        { expiresIn: '15m' },
      );
    });
  });

  describe('validateUser', () => {
    it('should return user for valid payload', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        sub: mockUser.id,
        phone_e164: mockUser.phone_e164,
        role: mockUser.role,
      });

      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      usersService.findById.mockRejectedValue(new UnauthorizedException('User not found'));

      await expect(
        service.validateUser({
          sub: 'non-existent-id',
          phone_e164: '+21612345678',
          role: 'client',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

