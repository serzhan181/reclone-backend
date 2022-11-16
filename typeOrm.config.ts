import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const moduleOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/**/**/entities/*.entity.js'],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/src/migrations/*.js'],
};

export default new DataSource(moduleOptions);
