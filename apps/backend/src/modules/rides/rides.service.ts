import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './ride.entity';
import { EarningsService } from '../earnings/earnings.service';

interface GeoPoint {
  lat: number;
  lng: number;
}

// Tunisia approximate bounds (for validation)
const TUNISIA_BOUNDS = {
  lat: { min: 30.2, max: 37.5 },
  lng: { min: 7.5, max: 11.6 },
};

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(
    @InjectRepository(Ride)
    private readonly ridesRepository: Repository<Ride>,
    @Inject(forwardRef(() => EarningsService))
    private readonly earningsService: EarningsService,
  ) {}

  /**
   * Request a new ride
   * Validates coordinates, creates ride in 'requested' status
   */
  async requestRide(
    riderUserId: string,
    pickup: GeoPoint,
    dropoff: GeoPoint,
    idempotencyKey?: string,
  ): Promise<Ride> {
    // Validate Tunisia bounds
    this.validateCoordinates(pickup);
    this.validateCoordinates(dropoff);

    // TODO: Check idempotency_key to prevent duplicates (future improvement)

    const ride = this.ridesRepository.create({
      rider_user_id: riderUserId,
      pickup: {
        type: 'Point',
        coordinates: [pickup.lng, pickup.lat], // PostGIS: [lng, lat]
      } as any,
      dropoff: {
        type: 'Point',
        coordinates: [dropoff.lng, dropoff.lat],
      } as any,
      status: 'requested',
    });

    const saved = await this.ridesRepository.save(ride);
    this.logger.log(`Ride ${saved.id} requested by user ${riderUserId}`);
    return saved;
  }

  /**
   * Find ride by ID with relations
   */
  async findById(rideId: string): Promise<Ride> {
    const ride = await this.ridesRepository.findOne({
      where: { id: rideId },
      relations: ['rider_user', 'driver'],
    });

    if (!ride) {
      throw new NotFoundException(`Ride ${rideId} not found`);
    }

    return ride;
  }

  /**
   * Assign driver to a requested ride
   * Only works if ride status is 'requested'
   */
  async assignDriver(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.findById(rideId);

    if (ride.status !== 'requested') {
      throw new BadRequestException(
        `Cannot assign driver to ride in status ${ride.status}`,
      );
    }

    ride.driver_id = driverId;
    ride.status = 'assigned';
    ride.assigned_at = new Date();

    const updated = await this.ridesRepository.save(ride);
    this.logger.log(`Ride ${rideId} assigned to driver ${driverId}`);
    return updated;
  }

  /**
   * Driver starts the ride
   * Only the assigned driver can start
   */
  async startRide(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.findById(rideId);

    if (ride.driver_id !== driverId) {
      throw new ForbiddenException(
        `Only assigned driver can start this ride`,
      );
    }

    if (ride.status !== 'assigned' && ride.status !== 'driver_arrived') {
      throw new BadRequestException(
        `Cannot start ride in status ${ride.status}`,
      );
    }

    ride.status = 'started';
    ride.started_at = new Date();

    const updated = await this.ridesRepository.save(ride);
    this.logger.log(`Ride ${rideId} started by driver ${driverId}`);
    return updated;
  }

  /**
   * Driver completes the ride and records cash payment
   */
  async completeRide(
    rideId: string,
    driverId: string,
    priceCents: number,
  ): Promise<Ride> {
    const ride = await this.findById(rideId);

    if (ride.driver_id !== driverId) {
      throw new ForbiddenException(
        `Only assigned driver can complete this ride`,
      );
    }

    if (ride.status !== 'started') {
      throw new BadRequestException(
        `Cannot complete ride in status ${ride.status}`,
      );
    }

    if (priceCents < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    ride.status = 'completed';
    ride.price_cents = priceCents;
    ride.completed_at = new Date();

    const updated = await this.ridesRepository.save(ride);
    this.logger.log(
      `Ride ${rideId} completed by driver ${driverId} for ${priceCents} cents`,
    );

    // Credit driver's earnings
    await this.earningsService.creditRide(driverId, rideId, priceCents);

    return updated;
  }

  /**
   * Cancel a ride
   * Can be done by rider (if not started) or driver (any time before completed)
   */
  async cancelRide(
    rideId: string,
    userId: string,
    userRole: 'rider' | 'driver',
    reason: string,
  ): Promise<Ride> {
    const ride = await this.findById(rideId);

    // Cannot cancel completed rides
    if (ride.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed ride');
    }

    // Verify ownership
    if (userRole === 'rider' && ride.rider_user_id !== userId) {
      throw new ForbiddenException('Not your ride');
    }
    if (userRole === 'driver' && ride.driver_id !== userId) {
      throw new ForbiddenException('Not your ride');
    }

    ride.status = 'cancelled';
    ride.cancelled_at = new Date();
    ride.cancellation_reason = reason;

    const updated = await this.ridesRepository.save(ride);
    this.logger.log(`Ride ${rideId} cancelled by ${userRole} ${userId}`);
    return updated;
  }

  /**
   * Validate coordinates are within Tunisia bounds
   */
  private validateCoordinates(point: GeoPoint): void {
    if (
      point.lat < TUNISIA_BOUNDS.lat.min ||
      point.lat > TUNISIA_BOUNDS.lat.max ||
      point.lng < TUNISIA_BOUNDS.lng.min ||
      point.lng > TUNISIA_BOUNDS.lng.max
    ) {
      throw new BadRequestException(
        `Coordinates (${point.lat}, ${point.lng}) are outside Tunisia bounds`,
      );
    }
  }
}
