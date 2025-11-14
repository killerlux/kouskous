import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

export class VerifyPhoneDto {
  phone_e164: string;
}

export class ExchangeTokenDto {
  phone_e164: string;
  otp_code: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-phone')
  @ApiOperation({ summary: 'Send OTP to phone' })
  async verifyPhone(@Body() dto: VerifyPhoneDto) {
    await this.authService.verifyPhone(dto.phone_e164);
    return { ok: true };
  }

  @Post('exchange-token')
  @ApiOperation({ summary: 'Exchange OTP for JWT' })
  async exchangeToken(@Body() dto: ExchangeTokenDto) {
    return this.authService.exchangeToken(dto.phone_e164, dto.otp_code);
  }
}

