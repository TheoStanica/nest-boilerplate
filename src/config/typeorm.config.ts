import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGO_URI,
  entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
  ssl: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  ignoreUndefined: true,
  synchronize: false,
};
