import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import * as winston from 'winston';
import { AllExceptionsFilter } from './common/filters/httpException.filter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          if (stack) {
            return `${timestamp} ${level}: ${message} - ${stack}`;
          }
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new winston.transports.File({
          filename: './logs/main.log',
        }),
      ],
    }),
    AuthModule,
    MailerModule,
    UserModule,
  ],
  providers: [AllExceptionsFilter],
})
export class AppModule {}
