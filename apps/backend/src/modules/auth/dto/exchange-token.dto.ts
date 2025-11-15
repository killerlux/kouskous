import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class ExchangeTokenDto {
  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+21612345678',
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone_e164: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  otp_code: string;
}

