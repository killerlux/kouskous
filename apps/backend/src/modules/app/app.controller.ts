import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root - Get API information' })
  getRoot() {
    return {
      name: 'Taxi Platform API',
      version: '1.1.0',
      description: 'REST API for Tunisian taxi ride-hailing platform',
      documentation: '/api/docs',
      health: '/health',
      endpoints: {
        auth: '/auth',
        users: '/users',
        drivers: '/drivers',
        rides: '/rides',
        admin: '/admin',
        health: '/health',
      },
    };
  }
}

