import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInCredentialsDto } from './dto/signInCredentials.dto';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: AuthRepository) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.userRepository.signUp(signUpCredentialsDto);
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<string> {
    const username = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate Access Token and refresh token?
    return `you are ${username}`;
  }
}
