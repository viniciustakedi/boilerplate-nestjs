import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ERole } from 'src/models/roles';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @MaxLength(155)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(11)
  @MinLength(10)
  phone: string;

  @IsString()
  @MaxLength(255, { message: 'A senha deve ter no máximo 255 caracteres' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsEnum(ERole, { each: true, message: 'Role/permissão não permitida' })
  @IsNotEmpty()
  roles: ERole[];
}

export class AddUserRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @MaxLength(155)
  @IsOptional()
  email: string;

  @IsString()
  @MaxLength(6)
  @MinLength(6)
  @IsOptional()
  code: string;
}
