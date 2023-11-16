import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERole } from 'src/models/roles';

export class UpdateUserDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name: string;

  @IsEmail()
  @MaxLength(155)
  @IsOptional()
  email: string;

  @IsString()
  @MaxLength(11)
  @MinLength(10)
  phone: string;

  @IsString()
  @MaxLength(255, { message: 'A senha deve ter no máximo 255 caracteres' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @IsOptional()
  password: string;

  @IsArray()
  @IsEnum(ERole, { each: true, message: 'Role/permissão não permitida' })
  @IsOptional()
  roles: ERole[];
}
