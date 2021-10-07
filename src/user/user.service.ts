import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from '../auth/common/dto/signUpCredentials.dto';
import { ResetPasswordRequestDto } from 'src/auth/common/dto/resetPasswordRequest.dto';
import { ResetPasswordCredentialsDto } from 'src/auth/common/dto/resetPasswordCredentials.dto';
import { ActivateAccountRequestDto } from 'src/auth/common/dto/activateAccountRequest.dto';

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

  async activateRequest(activateAccountRequestDto: ActivateAccountRequestDto) {
    const user = await this.userRepository.activateRequest(
      activateAccountRequestDto,
    );

    if (user) {
      this.transporter.sendEmail({
        to: user.email,
        subject: 'New Activation',
        html: '<h1>New Activation</h1>',
      });
    }
  }

  async activate(activationCode: string): Promise<void> {
    await this.userRepository.activate(activationCode);
  }

  async resetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<void> {
    const user = await this.userRepository.resetPasswordRequest(
      resetPasswordRequestDto,
    );
    if (user) {
      this.transporter.sendEmail({
        to: user.email,
        subject: 'Reset',
        html: '<h1>Hello</h1>',
      });
    }
  }

  async resetPassword(
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
    resetPasswordCode: string,
  ): Promise<void> {
    return this.userRepository.resetPassword(
      resetPasswordCredentialsDto,
      resetPasswordCode,
    );
  }

  async getById(id: string) {
    return this.userRepository.getById(id);
  }
}
