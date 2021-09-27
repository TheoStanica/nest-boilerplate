import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { MongoErrors } from './enums/mongoErrors.enum';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { email, password } = signUpCredentialsDto;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await this.hashPassword(password, salt);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;

    try {
      await user.save();
    } catch (error) {
      if (error.code === MongoErrors.DUPLICATE) {
        throw new ConflictException('Email is being used');
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    signInCredentials: SignInCredentialsDto,
  ): Promise<string> {
    const { email, password } = signInCredentials;
    const user = await User.findOne({ email: email });

    if (user && (await user.validatePassword(password))) {
      console.log(user);
      return `${user.id}`;
    } else {
      return null;
    }
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
