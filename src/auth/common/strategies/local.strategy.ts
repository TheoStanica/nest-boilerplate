import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthRepository } from '../../auth.repository';
import { SignInCredentialsDto } from '../dto/signInCredentials.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const signInCredentialsDto = { email, password } as SignInCredentialsDto;

    const user = await this.authRepository.validateUserPassword(
      signInCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
