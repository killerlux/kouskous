import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+21612345678',
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone must be in E.164 format (e.g., +21612345678)',
  })
  phone_e164: string;
}

