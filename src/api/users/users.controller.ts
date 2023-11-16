import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamsDto } from '../../utils/utilsDtos';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { ERole } from 'src/models/roles';
import { isSameUser } from 'src/utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.createUser(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin, ERole.writer)
  @Get(':id')
  async findOne(@Headers('Authorization') auth: string, @Param() params: ParamsDto) {
    if (!isSameUser(params.id, auth)) {
      throw new HttpException('Você tentou alterar um outro usuário!', HttpStatus.FORBIDDEN);
    }

    return this.usersService.findOne(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin, ERole.writer)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(
    @Headers('Authorization') auth: string,
    @Param() params: ParamsDto,
    @Body() payload: UpdateUserDto,
  ) {
    if (!isSameUser(params.id, auth)) {
      return new HttpException('Você tentou alterar outro usuário!', HttpStatus.FORBIDDEN);
    }

    return this.usersService.update(params.id, payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.admin)
  @Delete(':id')
  remove(@Param() params: ParamsDto) {
    return this.usersService.deleteUser(params.id);
  }
}
