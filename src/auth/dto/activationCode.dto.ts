import { IsNumber, isNumber, IsString, Matches } from 'class-validator';

export class ActivationCodeDto {
  @Matches(/(^[A-Fa-f0-9]{40,40}$)/, {
    message: 'Invalid activation code',
  })
  code: string;
}
