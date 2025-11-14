import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current driver profile' })
  async getMe(@Request() req: any) {
    const driver = await this.driversService.findByUserId(req.user.id);
    if (!driver) {
      throw new Error('Driver profile not found');
    }
    return driver;
  }

  @Post()
  @ApiOperation({ summary: 'Create driver profile' })
  async create(@Request() req: any, @Body() dto: CreateDriverDto) {
    return this.driversService.create(req.user.id, dto);
  }
}

