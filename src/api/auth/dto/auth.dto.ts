import { IsEAN, IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

}