import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const rootDir = process.env.NODE_ENV === 'production' ? './dist/src' : './src';

console.log(rootDir);

export const moduleOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [`./dist/src/**/entities/*.entity{.ts,.js}`],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'production',
  migrations: [`./dist/src/migrations/*{.ts,.js}`],
  ssl: true,
};

export default new DataSource(moduleOptions);
