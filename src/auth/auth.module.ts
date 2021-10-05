import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailerModule } from 'src/mailer/mailer.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './common/serializers/session.serializer';
import { LocalStrategy } from './common/strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, SessionSerializer],
  exports: [PassportModule],
})
export class AuthModule {}
