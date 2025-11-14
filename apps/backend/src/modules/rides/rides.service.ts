import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ride, RideStatus } from './ride.entity';
import { CreateRideDto, CompleteRideDto } from './dto/create-ride.dto';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private ridesRepository: Repository<Ride>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateRideDto, riderUserId: string): Promise<Ride> {
    // TODO: Enforce idempotency key deduplication

    // Create PostGIS points from lat/lng
    const pickupPoint = `ST_SetSRID(ST_MakePoint(${dto.pickup.lng}, ${dto.pickup.lat}), 4326)`;
    const dropoffPoint = `ST_SetSRID(ST_MakePoint(${dto.dropoff.lng}, ${dto.dropoff.lat}), 4326)`;

    // Use raw query to insert geometry
    const result = await this.dataSource.query(
      `INSERT INTO rides (rider_user_id, status, pickup, dropoff, requested_at)
       VALUES ($1, 'requested', ${pickupPoint}, ${dropoffPoint}, NOW())
       RETURNING id`,
      [riderUserId],
    );

    return this.findById(result[0].id);
  }

  async findById(id: string): Promise<Ride> {
    const ride = await this.ridesRepository.findOne({
      where: { id },
      relations: ['rider_user', 'driver'],
    });
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return ride;
  }

  async cancel(id: string, userId: string, reason?: string): Promise<void> {
    const ride = await this.findById(id);
    
    // Check ownership
    if (ride.rider_user.id !== userId && ride.driver?.user?.id !== userId) {
      throw new BadRequestException('Not authorized to cancel this ride');
    }

    // Check if can be cancelled
    if (['completed', 'cancelled'].includes(ride.status)) {
      throw new BadRequestException(`Cannot cancel ride in status: ${ride.status}`);
    }

    ride.status = 'cancelled';
    ride.cancelled_at = new Date();
    ride.cancellation_reason = reason;
    await this.ridesRepository.save(ride);
  }

  async start(id: string, driverId: string): Promise<void> {
    const ride = await this.findById(id);
    
    if (ride.driver?.id !== driverId) {
      throw new BadRequestException('Not the assigned driver');
    }

    if (ride.status !== 'assigned' && ride.status !== 'driver_arrived') {
      throw new BadRequestException(`Cannot start ride in status: ${ride.status}`);
    }

    ride.status = 'started';
    ride.started_at = new Date();
    await this.ridesRepository.save(ride);
  }

  async complete(id: string, driverId: string, dto: CompleteRideDto): Promise<void> {
    const ride = await this.findById(id);
    
    if (ride.driver?.id !== driverId) {
      throw new BadRequestException('Not the assigned driver');
    }

    if (ride.status !== 'started') {
      throw new BadRequestException(`Cannot complete ride in status: ${ride.status}`);
    }

    ride.status = 'completed';
    ride.completed_at = new Date();
    ride.price_cents = dto.price_cents;
    await this.ridesRepository.save(ride);

    // TODO: Create earnings ledger entry
  }
}

