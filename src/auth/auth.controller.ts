import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { SignUpCredentialsDto } from './common/dto/signUpCredentials.dto';
import { GetUser } from './common/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ResetPasswordRequestDto } from './common/dto/resetPasswordRequest.dto';
import { ResetPasswordCredentialsDto } from './common/dto/resetPasswordCredentials.dto';
import { ResetPasswordCodePipe } from './common/pipes/resetPasswordCode.pipe';
import { ActivationCodePipe } from './common/pipes/activationCode.pipe';
import { ActivateAccountRequestDto } from './common/dto/activateAccountRequest.dto';

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
  activateRequest(
    @Body(ValidationPipe) activateAccountRequestDto: ActivateAccountRequestDto,
  ) {
    return this.userService.activateRequest(activateAccountRequestDto);
  }

  @Post('/activate/:id')
  @HttpCode(200)
  activate(@Param('id', ActivationCodePipe) activationCode: string) {
    return this.userService.activate(activationCode);
  }

  @Post('/reset')
  @HttpCode(200)
  resetRequest(
    @Body(ValidationPipe) resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.userService.resetPasswordRequest(resetPasswordRequestDto);
  }

  @Post('/reset/:id')
  @HttpCode(200)
  reset(
    @Param('id', ResetPasswordCodePipe) resetPasswordCode: string,
    @Body(ValidationPipe)
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
  ) {
    return this.userService.resetPassword(
      resetPasswordCredentialsDto,
      resetPasswordCode,
    );
  }

  @Get('/test')
  @UseGuards(AuthenticatedGuard)
  test(@GetUser() user: UserDocument) {
    console.log(user);
    return user;
  }
}
