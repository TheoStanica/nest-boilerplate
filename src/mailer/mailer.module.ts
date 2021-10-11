import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseMailer } from './core/baseMailer';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MailerService, BaseMailer],
  exports: [MailerService],
})
export class MailerModule {}
