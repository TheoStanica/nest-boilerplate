import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Session,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { ActivationCodeDto } from './common/dto/activationCode.dto';
import { SignUpCredentialsDto } from './common/dto/signUpCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @UseGuards(SignInGuard)
  @Post('/signin')
  @HttpCode(200)
  async signIn() {}

  @Post('/activate')
  @HttpCode(200)
  activate(@Body(ValidationPipe) activationCodeDto: ActivationCodeDto) {
    return this.authService.activate(activationCodeDto);
  }

  @Get('/test')
  @UseGuards(AuthenticatedGuard)
  test(@Req() request: Request, @Session() session: Record<string, any>) {
    console.log(request.session.id);
    console.log(session.passport);
    session.visits++;
    return 'this is a test controller route';
  }
}
