import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
export class ChangePasswordDto {
    
    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/)
    @Matches(/[a-z]/)
    @Matches(/\d/)
    password: string;
  }