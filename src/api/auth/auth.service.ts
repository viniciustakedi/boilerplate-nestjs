import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createResponse, timeout } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validadeUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByLogin(login);
    if (!user) {
      await timeout(75);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;

    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async loginUser(user: any) {
    const payload = { sub: user.id, roles: user.roles, iss: process.env.JWT_ISSUER };
    return createResponse(
      this.jwtService.sign(payload),
      1,
      'Login efetuado com sucesso!',
      HttpStatus.CREATED,
    );
  }
}
