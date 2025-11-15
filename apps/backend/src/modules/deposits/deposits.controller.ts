import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DepositsService } from './deposits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Deposits')
@Controller('deposits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a deposit receipt for approval' })
  async create(@Request() req: any, @Body() body: { amount_cents: number; receipt_url: string }) {
    // Driver submits their own deposit
    return this.depositsService.submitDeposit(
      req.user.id,
      body.amount_cents,
      body.receipt_url,
    );
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a deposit (admin)' })
  async approve(@Param('id') id: string, @Request() req: any) {
    // TODO: Add @Roles('admin') guard
    await this.depositsService.approveDeposit(id, req.user.id);
    return { ok: true };
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a deposit (admin)' })
  async reject(@Param('id') id: string, @Request() req: any, @Body() body: { reason?: string }) {
    // TODO: Add @Roles('admin') guard
    await this.depositsService.rejectDeposit(
      id,
      req.user.id,
      body.reason || 'Rejected by admin',
    );
    return { ok: true };
  }
}

