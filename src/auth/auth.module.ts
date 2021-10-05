import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './common/serializers/session.serializer';
import { LocalStrategy } from './common/strategies/local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, UserModule],
  controllers: [AuthController],
  providers: [LocalStrategy, SessionSerializer],
  exports: [PassportModule],
})
export class AuthModule {}
