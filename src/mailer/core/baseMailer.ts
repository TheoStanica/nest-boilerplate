import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailData } from './../common/dto/emailData.dto';
import * as path from 'path';
import * as ejs from 'ejs';

export class BaseMailer {
  private transporter: Mail;
  constructor(readonly logger: Logger) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  protected async sendEmail(data: EmailData): Promise<void> {
    this.logger.info(`Sending an email (${data.subject}) to ${data.to}`);
    await this.transporter.sendMail({
      from: `"${process.env.APPLICATION_NAME}" ${process.env.GMAIL_USER}`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }

  protected async generateHtmlFromTemplate(
    name: string,
    data: any,
  ): Promise<string> {
    return await ejs.renderFile(
      path.join(__dirname + `./../../../emailTemplates/${name}.ejs`),
      { data },
    );
  }
}
