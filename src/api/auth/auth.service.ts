import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { timeout } from 'src/utils';

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
    const payload = { sub: user.id, role: user.role, iss: process.env.JWT_ISSUER };
    return { access_token: this.jwtService.sign(payload) };
  }
}
