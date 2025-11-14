import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  async findByUserId(userId: string): Promise<Driver | null> {
    return this.driversRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'vehicle'],
    });
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driversRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async create(userId: string, dto: CreateDriverDto): Promise<Driver> {
    const driver = this.driversRepository.create({
      user: { id: userId },
      license_number: dto.license_number,
      license_expiry: dto.license_expiry,
    });
    return this.driversRepository.save(driver);
  }

  async verifyDriver(driverId: string, adminUserId: string): Promise<Driver> {
    const driver = await this.findById(driverId);
    driver.verified_at = new Date();
    return this.driversRepository.save(driver);
  }

  async checkBalanceLock(driverId: string): Promise<boolean> {
    // Check materialized view for balance >= 1000 TND (100,000 cents)
    // This should query driver_balances_mv
    // For now, placeholder - will be implemented with actual balance check
    return false;
  }
}

