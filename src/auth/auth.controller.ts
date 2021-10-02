import { SignInCredentialsDto } from './dto/signInCredentials.dto';
import { SignUpCredentialsDto } from './dto/signUpCredentials.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivationCodeDto } from './dto/activationCode.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('/activate')
  @HttpCode(200)
  activate(@Body(ValidationPipe) activationCodeDto: ActivationCodeDto) {
    return this.authService.activate(activationCodeDto);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test() {
    return 'this is a test controller route';
  }
}
