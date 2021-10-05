import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthRepository } from './auth.repository';
import { SignUpCredentialsDto } from './common/dto/signUpCredentials.dto';
import { ActivationCodeDto } from './common/dto/activationCode.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: AuthRepository,
    private readonly transporter: MailerService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const user = await this.userRepository.signUp(signUpCredentialsDto);

    this.transporter.sendEmail({
      to: user.email,
      subject: 'Activation',
      html: '<h1>Hello</h1>',
    });
  }

  async activate(activationCodeDto: ActivationCodeDto): Promise<void> {
    await this.userRepository.activate(activationCodeDto);
  }
}
