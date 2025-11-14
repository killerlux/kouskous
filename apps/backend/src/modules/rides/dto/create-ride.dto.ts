import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeoPointDto {
  @ApiProperty({ example: 36.8065 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 10.1815 })
  @IsNumber()
  lng: number;
}

export class CreateRideDto {
  @ApiProperty()
  @IsNotEmpty()
  pickup: GeoPointDto;

  @ApiProperty()
  @IsNotEmpty()
  dropoff: GeoPointDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  idempotency_key?: string;
}

export class CompleteRideDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  price_cents: number;
}

