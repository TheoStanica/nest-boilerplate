import {
  Body,
  Controller,
  Get,
  HttpCode,
  ImATeapotException,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ResetPasswordCredentialsDto } from './common/dto/resetPasswordCredentials.dto';
import { ActivateAccountRequestDto } from './common/dto/activateAccountRequest.dto';
import { ResetPasswordRequestDto } from './common/dto/resetPasswordRequest.dto';
import { SignUpCredentialsDto } from './common/dto/signUpCredentials.dto';
import { ResetPasswordCodePipe } from './common/pipes/resetPasswordCode.pipe';
import { ActivationCodePipe } from './common/pipes/activationCode.pipe';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { SignInGuard } from './common/guards/login.guard';
import { GetUser } from './common/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @UseGuards(SignInGuard)
  @Post('/signin')
  @HttpCode(200)
  async signIn() {
    return;
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    this.logger.info(
      `Sign up request. Email: ${JSON.stringify({
        email: signUpCredentialsDto.email,
      })}`,
    );
    return this.userService.signUp(signUpCredentialsDto);
  }

  @Post('/activate')
  @HttpCode(200)
  activateRequest(
    @Body(ValidationPipe) activateAccountRequestDto: ActivateAccountRequestDto,
  ) {
    this.logger.info(
      `Activate account request. Data: ${JSON.stringify(
        activateAccountRequestDto,
      )}`,
    );
    return this.userService.activateRequest(activateAccountRequestDto);
  }

  @Post('/activate/:id')
  @HttpCode(200)
  activate(@Param('id', ActivationCodePipe) activationCode: string) {
    this.logger.info(
      `Activating account with activation code ${activationCode}`,
    );
    return this.userService.activate(activationCode);
  }

  @Post('/reset')
  @HttpCode(200)
  resetRequest(
    @Body(ValidationPipe) resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    this.logger.info(
      `Reset password request. Data: ${JSON.stringify(
        resetPasswordRequestDto,
      )}`,
    );
    return this.userService.resetPasswordRequest(resetPasswordRequestDto);
  }

  @Post('/reset/:id')
  @HttpCode(200)
  reset(
    @Param('id', ResetPasswordCodePipe) resetPasswordCode: string,
    @Body(ValidationPipe)
    resetPasswordCredentialsDto: ResetPasswordCredentialsDto,
  ) {
    this.logger.info(
      `Resetting password using reset code ${resetPasswordCode}`,
    );
    return this.userService.resetPassword(
      resetPasswordCredentialsDto,
      resetPasswordCode,
    );
  }

  @Get('/test')
  @UseGuards(AuthenticatedGuard)
  test(@GetUser() user: UserDocument) {
    console.log(user);
    this.logger.info(`user ${user.id} requested his profile information`);
    return user;
  }
}
