import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInCredentialsDto } from '../auth/common/dto/signInCredentials.dto';
import { SignUpCredentialsDto } from '../auth/common/dto/signUpCredentials.dto';
import { ActivationCodeDto } from '../auth/common/dto/activationCode.dto';
import { AccountStatus } from '../auth/common/enums/accountStatus.enum';
import { User, UserDocument } from './schemas/user.schema';
import { MongoErrors } from '../auth/common/enums/mongoErrors.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private User: Model<UserDocument>) {}

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
    user.activationExpirationDate = new Date(+new Date() + 10 * 60 * 1000);

    try {
      return await user.save();
    } catch (error) {
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
    console.log(email, password);
    const user = await this.User.findOne({ email: email });

    if (!user) {
      return null;
    }

    if (await user.validatePassword(password)) {
      // do something about this
      if (user.status === AccountStatus.PENDING) {
        throw new UnauthorizedException('Account not verified');
      }

      return user;
    } else {
      return null;
    }
  }

  async activate(activationCodeDto: ActivationCodeDto): Promise<void> {
    const { code } = activationCodeDto;
    const user = await this.User.findOne({ activationCode: code });

    if (!user || this.isExpired(user.activationExpirationDate)) {
      throw new BadRequestException('Invalid activation code');
    }

    user.status = AccountStatus.ACTIVE;
    await user.save();
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private isExpired(date: Date): boolean {
    return new Date(date) < new Date();
  }
}
