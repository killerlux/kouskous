import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Point } from 'typeorm';
import { RidesService } from '../src/modules/rides/rides.service';
import { Ride } from '../src/modules/rides/ride.entity';

const createMockPoint = (lng: number, lat: number): Point => ({
  type: 'Point',
  coordinates: [lng, lat],
});

describe('RidesService', () => {
  let service: RidesService;
  let repo: jest.Mocked<Repository<Ride>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Ride>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        RidesService,
        { provide: getRepositoryToken(Ride), useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(RidesService);
  });

  it('creates a ride with geometry points', async () => {
    const dto = {
      pickup: { lat: 36.1, lng: 10.2 },
      dropoff: { lat: 36.8, lng: 10.3 },
    };

    const ride = { id: 'ride-1' } as Ride;
    repo.create.mockReturnValue(ride);
    repo.save.mockResolvedValue({ ...ride, status: 'requested' });

    const result = await service.create(dto, 'user-1');

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rider_user: { id: 'user-1' },
        pickup: createMockPoint(dto.pickup.lng, dto.pickup.lat),
        dropoff: createMockPoint(dto.dropoff.lng, dto.dropoff.lat),
      }),
    );
    expect(repo.save).toHaveBeenCalledWith(ride);
    expect(result).toMatchObject({ id: 'ride-1', status: 'requested' });
  });

  it('throws when cancelling without permission', async () => {
    const ride = {
      id: 'ride-1',
      status: 'assigned',
      rider_user: { id: 'rider-1' },
      driver: { id: 'driver-1', user: { id: 'driver-user' } },
    } as unknown as Ride;
    repo.findOne.mockResolvedValue(ride);

    await expect(service.cancel('ride-1', 'intruder')).rejects.toThrow('Not authorized');
  });

  it('completes ride when driver matches', async () => {
    const ride = {
      id: 'ride-1',
      status: 'started',
      rider_user: { id: 'rider-1' },
      driver: { id: 'driver-1', user: { id: 'driver-user' } },
    } as unknown as Ride;
    repo.findOne.mockResolvedValue(ride);
    repo.save.mockResolvedValue(ride);

    await service.complete('ride-1', 'driver-1', { price_cents: 5000 });

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        price_cents: 5000,
      }),
    );
  });
});

