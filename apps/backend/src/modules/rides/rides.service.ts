import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Point } from 'typeorm';
import { Ride } from './ride.entity';
import { CreateRideDto, CompleteRideDto } from './dto/create-ride.dto';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private readonly ridesRepository: Repository<Ride>,
  ) {}

  private static toPoint(lat: number, lng: number): Point {
    return { type: 'Point', coordinates: [lng, lat] };
  }

  async create(dto: CreateRideDto, riderUserId: string): Promise<Ride> {
    const ride = this.ridesRepository.create({
      rider_user: { id: riderUserId } as User,
      status: 'requested',
      pickup: RidesService.toPoint(dto.pickup.lat, dto.pickup.lng),
      dropoff: RidesService.toPoint(dto.dropoff.lat, dto.dropoff.lng),
      requested_at: new Date(),
    });

    return this.ridesRepository.save(ride);
  }

  async findById(id: string): Promise<Ride> {
    const ride = await this.ridesRepository.findOne({
      where: { id },
      relations: ['rider_user', 'driver', 'driver.user'],
    });
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return ride;
  }

  async cancel(id: string, actorUserId: string, reason?: string): Promise<void> {
    const ride = await this.findById(id);

    const driverUserId = ride.driver?.user?.id;
    if (ride.rider_user.id !== actorUserId && driverUserId !== actorUserId) {
      throw new BadRequestException('Not authorized to cancel this ride.');
    }

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
      throw new BadRequestException('Not the assigned driver.');
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
      throw new BadRequestException('Not the assigned driver.');
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

