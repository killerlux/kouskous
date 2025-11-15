import { Controller, Post, Delete, Body, UseGuards, Req, HttpCode, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeviceTokensService } from './device-tokens.service';
import { RegisterTokenDto } from './dto';

@ApiTags('device-tokens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('device-tokens')
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}

  @Post()
  @HttpCode(204)
  @ApiOperation({ summary: 'Register device token for push notifications' })
  @ApiResponse({ status: 204, description: 'Token registered' })
  async register(@Request() req: any, @Body() dto: RegisterTokenDto) {
    await this.deviceTokensService.registerToken(
      req.user.id,
      dto.platform,
      dto.token,
    );
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove device token (on logout)' })
  @ApiResponse({ status: 204, description: 'Token removed' })
  async remove(@Request() req: any, @Body() dto: RegisterTokenDto) {
    await this.deviceTokensService.removeToken(
      req.user.id,
      dto.platform,
      dto.token,
    );
  }
}

