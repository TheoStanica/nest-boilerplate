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
import { UserService } from '../user/user.service';
import { SignInGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { ActivationCodeDto } from './common/dto/activationCode.dto';
import { SignUpCredentialsDto } from './common/dto/signUpCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    return this.userService.signUp(signUpCredentialsDto);
  }

  @UseGuards(SignInGuard)
  @Post('/signin')
  @HttpCode(200)
  async signIn() {}

  @Post('/activate')
  @HttpCode(200)
  activate(@Body(ValidationPipe) activationCodeDto: ActivationCodeDto) {
    return this.userService.activate(activationCodeDto);
  }

  @Get('/test')
  @UseGuards(AuthenticatedGuard)
  test(@Req() request: Request, @Session() session: Record<string, any>) {
    console.log(request.session.id);
    console.log(session.passport);
    session.visits++;
    return session.passport.user;
  }
}
