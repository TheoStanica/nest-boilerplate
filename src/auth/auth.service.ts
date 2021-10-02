import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import { AuthRepository } from './auth.repository';
import { User, UserDocument } from './schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';
import { ActivationCodeDto } from './dto/activationCode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountStatus } from './enums/accountStatus.enum';

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

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<UserDocument> {
    const username = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate Access Token and refresh token?
    return username;
  }

  async activate(activationCodeDto: ActivationCodeDto): Promise<void> {
    await this.userRepository.activate(activationCodeDto);
  }
}
