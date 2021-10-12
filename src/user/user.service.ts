import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from '../auth/common/dto/signUpCredentials.dto';
import { ResetPasswordRequestDto } from 'src/auth/common/dto/resetPasswordRequest.dto';
import { ResetPasswordCredentialsDto } from 'src/auth/common/dto/resetPasswordCredentials.dto';
import { ActivateAccountRequestDto } from 'src/auth/common/dto/activateAccountRequest.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly mailer: MailerService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    this.logger.info(
      `Creating account. Data: ${JSON.stringify({
        email: signUpCredentialsDto.email,
      })}`,
    );
    const user = await this.userRepository.signUp(signUpCredentialsDto);

    if (user) {
      this.mailer.sendActivationEmail(user);
    }
  }

  async activateRequest(activateAccountRequestDto: ActivateAccountRequestDto) {
    this.logger.info(
      `Generating new activation code. Data: ${JSON.stringify(
        activateAccountRequestDto,
      )}`,
    );
    const user = await this.userRepository.activateRequest(
      activateAccountRequestDto,
    );

    if (user) {
      this.mailer.sendActivationEmail(user);
    }
  }

  async activate(activationCode: string): Promise<void> {
    this.logger.info(`Activating account. Activation code: ${activationCode}`);
    await this.userRepository.activate(activationCode);
  }

  async resetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<void> {
    this.logger.info(
      `Generating new reset password code. Data: ${JSON.stringify(
        resetPasswordRequestDto,
      )}`,
    );
    const user = await this.userRepository.resetPasswordRequest(
      resetPasswordRequestDto,
    );
    if (user) {
      this.mailer.sendResetPasswordEmail(user);
    }
  }

  async resetPassword(
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
    resetPasswordCode: string,
  ): Promise<void> {
    this.logger.info(`Resetting password. Reset code: ${resetPasswordCode}`);
    return this.userRepository.resetPassword(
      resetPasswordCredentialsDto,
      resetPasswordCode,
    );
  }

  async getById(id: string) {
    return this.userRepository.getById(id);
  }
}
