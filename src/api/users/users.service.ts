import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../../entities';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  createResponse,
  createTextResponse,
  generateCode,
  hashPassword,
  validateEmail,
} from 'src/utils';
import { DataSourceType } from 'src/models/database';
import { ERepository } from 'src/models/repositories';

@Injectable()
export class UsersService {
  constructor(
    @Inject(ERepository.user)
    private UserRepository: Repository<User>,

    @Inject(DataSourceType)
    private DataSource: Repository<DataSource>,
  ) {}

  //Use only for login
  async findUserByLogin(login: any): Promise<any> {
    try {
      const isEmail = validateEmail(login);

      const user = await this.UserRepository.createQueryBuilder('user')
        .where(`${isEmail ? 'email = :login' : 'code = :login'}`, { login })
        .andWhere('user.is_deleted = false')
        .getOne();

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  async createUser(payload: CreateUserDto) {
    try {
      let code = generateCode();
      let codeVerify = false;

      while (!codeVerify) {
        const codeSearch = await this.UserRepository.findOne({
          where: { code },
        });

        if (codeSearch) code = generateCode();
        else codeVerify = true;
      }

      const user = new User({ code, ...payload });
      await this.UserRepository.save(user);

      return createTextResponse(
        'Usuário cadastrado com sucesso.',
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const total = await this.UserRepository.count();
      const users = await this.UserRepository.find({
        where: { isDeleted: false },
        select: ['id', 'name', 'email', 'phone', 'code', 'role'],
      });

      if (!users) {
        throw new HttpException(
          'Nenhum funcionário encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return createResponse(
        users,
        total,
        'Usuários encontrados.',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async findOne(id: string): Promise<any> {
    try {
      const user = await this.UserRepository.findOne({
        where: { id, isDeleted: false },
        select: ['id', 'name', 'email', 'phone', 'code', 'role'],
      });
      if (!user) {
        throw new HttpException(
          'Nenhum usuário encontrado!',
          HttpStatus.NOT_FOUND,
        );
      }

      return createResponse(user, 1, "Usuário encontrado.", HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async update(id: string, payload: UpdateUserDto): Promise<any> {
    try {
      const user = await this.UserRepository.findOne({
        where: { id, isDeleted: false },
      });

      if (user) {
        let password: string;
        const { password: pass } = payload;

        if (pass) {
          password = await hashPassword(pass);
        }

        payload.password = password;
        this.UserRepository.merge(user, { ...payload });
        this.UserRepository.save(user);

        return createTextResponse(
          'Usuário atualizado com sucesso.',
          HttpStatus.OK,
        );
      }

      throw new HttpException(
        'Nenhum usuário encontrado!',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async deleteUser(id: string) {
    try {
      const user = await this.UserRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!user) {
        throw new HttpException(
          'Nenhum usuário encontrado!',
          HttpStatus.NOT_FOUND,
        );
      }

      const isDeleted = {
        isDeleted: true,
      };

      this.UserRepository.merge(user, { ...isDeleted });
      this.UserRepository.save(user);

      return createTextResponse(
        'Usuário deletado com sucesso.',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
