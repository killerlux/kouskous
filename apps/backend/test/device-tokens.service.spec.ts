import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTokensService } from '../src/modules/device-tokens/device-tokens.service';
import { DeviceToken } from '../src/modules/device-tokens/device-token.entity';

describe('DeviceTokensService', () => {
  let service: DeviceTokensService;
  let repository: jest.Mocked<Repository<DeviceToken>>;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockToken = {
    user_id: mockUserId,
    platform: 'ios' as const,
    token: 'mock-fcm-token-123',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceTokensService,
        {
          provide: getRepositoryToken(DeviceToken),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeviceTokensService>(DeviceTokensService);
    repository = module.get(getRepositoryToken(DeviceToken));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerToken', () => {
    it('should create new device token if not exists', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockToken as any);
      repository.save.mockResolvedValue(mockToken as any);

      await service.registerToken(mockUserId, 'ios', 'mock-fcm-token-123');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: mockUserId,
          platform: 'ios',
          token: 'mock-fcm-token-123',
        },
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should not create duplicate token if already exists', async () => {
      repository.findOne.mockResolvedValue(mockToken as any);

      await service.registerToken(mockUserId, 'ios', 'mock-fcm-token-123');

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle android platform', async () => {
      const androidToken = { ...mockToken, platform: 'android' as const };
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(androidToken as any);
      repository.save.mockResolvedValue(androidToken as any);

      await service.registerToken(mockUserId, 'android', 'mock-fcm-token-456');

      expect(repository.create).toHaveBeenCalledWith({
        user_id: mockUserId,
        platform: 'android',
        token: 'mock-fcm-token-456',
      });
    });
  });

  describe('removeToken', () => {
    it('should delete device token', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeToken(mockUserId, 'ios', 'mock-fcm-token-123');

      expect(repository.delete).toHaveBeenCalledWith({
        user_id: mockUserId,
        platform: 'ios',
        token: 'mock-fcm-token-123',
      });
    });
  });

  describe('getUserTokens', () => {
    it('should return all tokens for a user', async () => {
      const tokens = [
        mockToken,
        { ...mockToken, platform: 'android' as const, token: 'token-2' },
      ];
      repository.find.mockResolvedValue(tokens as any);

      const result = await service.getUserTokens(mockUserId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
      });
      expect(result).toEqual(tokens);
    });

    it('should return empty array if user has no tokens', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.getUserTokens(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('hasToken', () => {
    it('should return true if token exists', async () => {
      repository.findOne.mockResolvedValue(mockToken as any);

      const result = await service.hasToken(mockUserId, 'ios', 'mock-fcm-token-123');

      expect(result).toBe(true);
    });

    it('should return false if token does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.hasToken(mockUserId, 'ios', 'unknown-token');

      expect(result).toBe(false);
    });
  });
});

