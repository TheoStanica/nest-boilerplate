import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { EmailData } from './common/dto/emailData.dto';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as ejs from 'ejs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserDocument } from 'src/user/schemas/user.schema';
import { BaseMailer } from './core/baseMailer';

@Injectable()
export class MailerService extends BaseMailer {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger) {
    super(logger);
  }

  async sendResetPasswordEmail(user: UserDocument): Promise<void> {
    return await this.sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: await this.generateResetEmail(user),
    });
  }

  private async generateResetEmail(user: UserDocument): Promise<string> {
    const { firstName, resetPasswordCode } = user;
    return await this.generateHtmlFromTemplate('resetPassword', {
      firstName,
      resetPasswordCode,
    });
  }

  async sendActivationEmail(user: UserDocument): Promise<void> {
    return await this.sendEmail({
      to: user.email,
      subject: 'Account Activation',
      html: await this.generateActivationEmail(user),
    });
  }

  private async generateActivationEmail(user: UserDocument): Promise<string> {
    const { firstName, activationCode } = user;
    return await this.generateHtmlFromTemplate('activate', {
      firstName,
      activationCode,
    });
  }
}
