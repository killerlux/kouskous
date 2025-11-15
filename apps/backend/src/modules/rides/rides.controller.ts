import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RidesService } from './rides.service';
import { CreateRideDto, CompleteRideDto } from './dto/create-ride.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Rides')
@Controller('rides')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  @ApiOperation({ summary: 'Request a ride' })
  async create(@Request() req: any, @Body() dto: CreateRideDto) {
    return this.ridesService.requestRide(
      req.user.id,
      dto.pickup,
      dto.dropoff,
      dto.idempotency_key,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async get(@Param('id') id: string) {
    return this.ridesService.findById(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a ride' })
  @ApiParam({ name: 'id', type: 'string' })
  async cancel(@Param('id') id: string, @Request() req: any, @Body() body: { reason?: string }) {
    // Determine if user is rider or driver based on role
    const userRole = req.user.role === 'driver' ? 'driver' : 'rider';
    await this.ridesService.cancelRide(id, req.user.id, userRole, body.reason || 'Cancelled by user');
    return { ok: true };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Driver starts the ride' })
  @ApiParam({ name: 'id', type: 'string' })
  async start(@Param('id') id: string, @Request() req: any) {
    // Driver uses their user ID (they have driver record linked)
    await this.ridesService.startRide(id, req.user.id);
    return { ok: true };
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Driver completes the ride and records cash' })
  @ApiParam({ name: 'id', type: 'string' })
  async complete(@Param('id') id: string, @Request() req: any, @Body() dto: CompleteRideDto) {
    await this.ridesService.completeRide(id, req.user.id, dto.price_cents);
    return { ok: true };
  }
}

