import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DepositsService } from '../deposits/deposits.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('admin')
export class AdminController {
  constructor(
    private readonly depositsService: DepositsService,
  ) {}

  @Get('deposits/pending')
  @ApiOperation({ summary: 'Get all pending deposit submissions (admin queue)' })
  async getPendingDeposits() {
    return this.depositsService.getPendingDeposits();
  }

  @Get('deposits')
  @ApiOperation({ summary: 'Get all deposits (admin)' })
  @ApiQuery({ name: 'driver_id', required: false, description: 'Filter by driver ID' })
  async getAllDeposits(@Query('driver_id') driverId?: string) {
    if (driverId) {
      return this.depositsService.getDriverDeposits(driverId);
    }
    // TODO: Implement getAll method in DepositsService
    return this.depositsService.getPendingDeposits();
  }

  @Get('deposits/:id')
  @ApiOperation({ summary: 'Get deposit details (admin)' })
  async getDeposit(@Param('id') id: string) {
    return this.depositsService.findById(id);
  }

  // TODO: Add verification queue endpoints
  // GET /admin/verification-queue - pending driver document verifications
  // POST /admin/drivers/:id/verify - verify driver documents
  // POST /admin/drivers/:id/reject - reject driver application
}

