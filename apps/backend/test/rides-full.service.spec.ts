import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RidesService } from '../src/modules/rides/rides.service';
import { Ride } from '../src/modules/rides/ride.entity';
import { EarningsService } from '../src/modules/earnings/earnings.service';

describe('RidesService (Full Implementation)', () => {
  let service: RidesService;
  let repository: jest.Mocked<Repository<Ride>>;
  let earningsService: jest.Mocked<any>;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockDriverId = '223e4567-e89b-12d3-a456-426614174000';
  const mockRideId = '323e4567-e89b-12d3-a456-426614174000';

  const mockRide = {
    id: mockRideId,
    rider_user_id: mockUserId,
    driver_id: null,
    status: 'requested' as const,
    pickup: { type: 'Point', coordinates: [10.1815, 36.8065] }, // Tunis
    dropoff: { type: 'Point', coordinates: [10.1658, 36.8027] },
    est_price_cents: 5000,
    price_cents: null,
    distance_m: null,
    duration_s: null,
    requested_at: new Date(),
    assigned_at: null,
    started_at: null,
    completed_at: null,
    cancelled_at: null,
    cancellation_reason: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        {
          provide: getRepositoryToken(Ride),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: EarningsService,
          useValue: {
            creditRide: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RidesService>(RidesService);
    repository = module.get(getRepositoryToken(Ride));
    earningsService = module.get(EarningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestRide', () => {
    it('should create a new ride request', async () => {
      repository.create.mockReturnValue(mockRide as any);
      repository.save.mockResolvedValue(mockRide as any);

      const result = await service.requestRide(
        mockUserId,
        { lat: 36.8065, lng: 10.1815 },
        { lat: 36.8027, lng: 10.1658 },
        'idempotency-key-123',
      );

      expect(repository.create).toHaveBeenCalledWith({
        rider_user_id: mockUserId,
        pickup: expect.objectContaining({ type: 'Point' }),
        dropoff: expect.objectContaining({ type: 'Point' }),
        status: 'requested',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.status).toBe('requested');
    });

    it('should validate coordinates are in Tunisia bounds', async () => {
      await expect(
        service.requestRide(
          mockUserId,
          { lat: 48.8566, lng: 2.3522 }, // Paris
          { lat: 36.8027, lng: 10.1658 },
          'key',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return ride if found', async () => {
      repository.findOne.mockResolvedValue(mockRide as any);

      const result = await service.findById(mockRideId);

      expect(result).toEqual(mockRide);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockRideId },
        relations: ['rider_user', 'driver'],
      });
    });

    it('should throw NotFoundException if ride not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignDriver', () => {
    it('should assign driver to requested ride', async () => {
      const requestedRide = { ...mockRide, status: 'requested' };
      repository.findOne.mockResolvedValue(requestedRide as any);
      repository.save.mockResolvedValue({
        ...requestedRide,
        driver_id: mockDriverId,
        status: 'assigned',
        assigned_at: new Date(),
      } as any);

      const result = await service.assignDriver(mockRideId, mockDriverId);

      expect(result.driver_id).toBe(mockDriverId);
      expect(result.status).toBe('assigned');
      expect(result.assigned_at).toBeDefined();
    });

    it('should reject assigning to non-requested ride', async () => {
      const assignedRide = { ...mockRide, status: 'assigned', driver_id: 'other-driver' };
      repository.findOne.mockResolvedValue(assignedRide as any);

      await expect(
        service.assignDriver(mockRideId, mockDriverId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('startRide', () => {
    it('should start assigned ride', async () => {
      const assignedRide = {
        ...mockRide,
        status: 'assigned',
        driver_id: mockDriverId,
      };
      repository.findOne.mockResolvedValue(assignedRide as any);
      repository.save.mockResolvedValue({
        ...assignedRide,
        status: 'started',
        started_at: new Date(),
      } as any);

      const result = await service.startRide(mockRideId, mockDriverId);

      expect(result.status).toBe('started');
      expect(result.started_at).toBeDefined();
    });

    it('should prevent non-assigned driver from starting', async () => {
      const assignedRide = {
        ...mockRide,
        status: 'assigned',
        driver_id: mockDriverId,
      };
      repository.findOne.mockResolvedValue(assignedRide as any);

      await expect(
        service.startRide(mockRideId, 'wrong-driver-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('completeRide', () => {
    it('should complete started ride with cash', async () => {
      const startedRide = {
        ...mockRide,
        status: 'started',
        driver_id: mockDriverId,
      };
      repository.findOne.mockResolvedValue(startedRide as any);
      repository.save.mockResolvedValue({
        ...startedRide,
        status: 'completed',
        price_cents: 5000,
        completed_at: new Date(),
      } as any);

      const result = await service.completeRide(mockRideId, mockDriverId, 5000);

      expect(result.status).toBe('completed');
      expect(result.price_cents).toBe(5000);
      expect(result.completed_at).toBeDefined();
      expect(earningsService.creditRide).toHaveBeenCalledWith(mockDriverId, mockRideId, 5000);
    });

    it('should reject negative price', async () => {
      const startedRide = {
        ...mockRide,
        status: 'started',
        driver_id: mockDriverId,
      };
      repository.findOne.mockResolvedValue(startedRide as any);

      await expect(
        service.completeRide(mockRideId, mockDriverId, -100),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelRide', () => {
    it('should cancel ride if rider owns it', async () => {
      repository.findOne.mockResolvedValue(mockRide as any);
      repository.save.mockResolvedValue({
        ...mockRide,
        status: 'cancelled',
        cancelled_at: new Date(),
        cancellation_reason: 'Rider cancelled',
      } as any);

      const result = await service.cancelRide(mockRideId, mockUserId, 'rider', 'Rider cancelled');

      expect(result.status).toBe('cancelled');
      expect(result.cancelled_at).toBeDefined();
    });

    it('should prevent cancelling completed ride', async () => {
      const completedRide = {
        ...mockRide,
        status: 'completed',
        completed_at: new Date(),
      };
      repository.findOne.mockResolvedValue(completedRide as any);

      await expect(
        service.cancelRide(mockRideId, mockUserId, 'rider', 'Late cancel attempt'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

