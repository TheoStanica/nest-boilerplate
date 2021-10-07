import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserRepository } from '../../../user/user.repository';
import { SignInCredentialsDto } from '../dto/signInCredentials.dto';
import { AccountStatus } from '../enums/accountStatus.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: UserRepository) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const signInCredentialsDto = { email, password } as SignInCredentialsDto;

    const user = await this.authRepository.validateUserCredentials(
      signInCredentialsDto,
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (user.status === AccountStatus.PENDING) {
      throw new UnauthorizedException('Account not verified');
    }
    if (user.status === AccountStatus.BANNED) {
      throw new ForbiddenException('Account banned');
    }

    return user;
  }
}
