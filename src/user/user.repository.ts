import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInCredentialsDto } from '../auth/common/dto/signInCredentials.dto';
import { SignUpCredentialsDto } from '../auth/common/dto/signUpCredentials.dto';
import { AccountStatus } from '../auth/common/enums/accountStatus.enum';
import { User, UserDocument } from './schemas/user.schema';
import { MongoErrors } from '../auth/common/enums/mongoErrors.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ResetPasswordRequestDto } from 'src/auth/common/dto/resetPasswordRequest.dto';
import { ResetPasswordCredentialsDto } from 'src/auth/common/dto/resetPasswordCredentials.dto';
import { ActivateAccountRequestDto } from 'src/auth/common/dto/activateAccountRequest.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(User.name) private User: Model<UserDocument>,
  ) {}

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<UserDocument> {
    const { email, password, firstName, lastName } = signUpCredentialsDto;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await this.hashPassword(password, salt);

    const user = new this.User();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.activationCode = crypto.randomBytes(20).toString('hex');
    user.activationExpirationDate = this.generateExpiration();

    try {
      return await user.save();
    } catch (error) {
      this.logger.warn(
        `Failed to create an account. Data: ${JSON.stringify({
          email,
          firstName,
          lastName,
          code: error?.code,
        })}`,
      );
      if (error.code === MongoErrors.DUPLICATE) {
        throw new ConflictException('Email is being used');
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserCredentials(
    signInCredentials: SignInCredentialsDto,
  ): Promise<UserDocument> {
    const { email, password } = signInCredentials;
    const user = await this.User.findOne({ email: email });

    if (!user) {
      return null;
    }

    if (await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  async activateRequest(
    activateAccountRequestDto: ActivateAccountRequestDto,
  ): Promise<UserDocument | null> {
    const { email } = activateAccountRequestDto;
    const user = await this.User.findOne({ email });

    if (!user) {
      return null;
    }
    if (user.status != AccountStatus.PENDING) {
      throw new BadRequestException('Account already activated');
    }

    user.activationCode = crypto.randomBytes(20).toString('hex');
    user.activationExpirationDate = this.generateExpiration();

    return await user.save();
  }

  async activate(activationCode: string): Promise<void> {
    const user = await this.User.findOne({ activationCode });

    if (user.status != AccountStatus.PENDING) {
      throw new BadRequestException('Account already activated');
    }

    if (!user || this.isExpired(user.activationExpirationDate)) {
      throw new BadRequestException('Invalid activation code');
    }

    user.status = AccountStatus.ACTIVE;

    await user.save();
  }

  async resetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<UserDocument | null> {
    const { email } = resetPasswordRequestDto;
    const user = await this.User.findOne({ email });

    if (!user) {
      return null;
    }

    user.resetPasswordCode = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpirationDate = this.generateExpiration();

    return await user.save();
  }

  async resetPassword(
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
    resetPasswordCode: string,
  ): Promise<void> {
    const { password } = resetPasswordCredentialsDto;
    const user = await this.User.findOne({ resetPasswordCode });

    if (!user || this.isExpired(user.resetPasswordExpirationDate)) {
      throw new BadRequestException('Invalid reset code');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await this.hashPassword(password, salt);
    user.password = hashedPassword;

    await user.save();
  }

  async getById(id: string): Promise<UserDocument> {
    return await this.User.findById(id);
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private isExpired(date: Date): boolean {
    return new Date(date) < new Date();
  }

  private generateExpiration(): Date {
    return new Date(+new Date() + 10 * 60 * 1000);
  }
}
