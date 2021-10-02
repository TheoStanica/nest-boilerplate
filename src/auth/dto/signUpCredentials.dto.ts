import {
  IsAlpha,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
