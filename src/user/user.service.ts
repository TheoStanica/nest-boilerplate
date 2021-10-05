import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from '../auth/common/dto/signUpCredentials.dto';
import { ActivationCodeDto } from '../auth/common/dto/activationCode.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
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
