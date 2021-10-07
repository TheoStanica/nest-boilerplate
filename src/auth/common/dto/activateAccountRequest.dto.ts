import { IsEmail, IsString } from 'class-validator';

export class ActivateAccountRequestDto {
  @IsString()
  @IsEmail()
  email: string;
}
