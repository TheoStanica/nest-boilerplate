import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  @IsEmail()
  email: string;
}
