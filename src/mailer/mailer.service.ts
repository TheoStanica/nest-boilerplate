import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { EmailData } from './common/dto/emailData.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Mail;

  constructor() {
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

  async sendEmail(data: EmailData) {
    await this.transporter.sendMail({
      from: `"${process.env.APPLICATION_NAME}" ${process.env.GMAIL_USER}`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
