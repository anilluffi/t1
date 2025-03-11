import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
export class ResetPasswordDto {
    @IsEmail()
    email: string;

  }
  