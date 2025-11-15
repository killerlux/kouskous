import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { VerifyPhoneDto, ExchangeTokenDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-phone')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @ApiOperation({ summary: 'Send OTP to phone' })
  @ApiResponse({ status: 204, description: 'OTP sent successfully' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async verifyPhone(@Body() dto: VerifyPhoneDto): Promise<void> {
    await this.authService.verifyPhone(dto.phone_e164);
  }

  @Post('exchange-token')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Exchange OTP for JWT' })
  @ApiResponse({
    status: 200,
    description: 'JWT tokens issued',
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        expires_in: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async exchangeToken(@Body() dto: ExchangeTokenDto) {
    return this.authService.exchangeToken(dto.phone_e164, dto.otp_code);
  }
}

