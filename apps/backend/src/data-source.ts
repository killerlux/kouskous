/**
 * TypeORM Data Source for CLI commands (migrations, etc.)
 * 
 * This file is used by TypeORM CLI tools for running migrations.
 * The main app uses the TypeOrmModule configuration in app.module.ts
 * 
 * Usage: Set DATABASE_URL env var before running migration commands
 */

import { DataSource } from 'typeorm';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:15432/taxi_dev',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
});

export default AppDataSource;

