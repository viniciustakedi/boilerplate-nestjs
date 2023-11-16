import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas';
import {
  createResponse,
  createTextResponse,
  generateCode,
  hashPassword,
} from 'src/utils';
import * as moment from 'moment';
import { isUserAdmin, parseJwt } from 'src/utils/functions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<Users>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async create(payload: CreateUserDto, auth: string) {
    try {
      const { password, roles, ...rest } = payload;

      const isNewUserAdmin = roles.find((role) => role === 'admin');

      if (isNewUserAdmin) {
        if (!auth || !isUserAdmin(auth)) {
          throw new HttpException(
            'Only admin can create admin users!',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }

      let code = generateCode();
      let codeExists = true;

      while (codeExists) {
        const findCode = await this.userModel.findOne({ code }).exec();
        if (!findCode) {
          codeExists = false;
        } else {
          code = generateCode();
        }
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new this.userModel({
        ...rest,
        roles,
        password: hashedPassword,
        code,
      });

      await newUser.save();

      return createTextResponse(
        'User created successfully!',
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  @HttpCode(HttpStatus.OK)
  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .where('isDeleted')
        .equals(false)
        .select('-password -isDeleted -createdAt -__v')
        .exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      return createResponse(user, 1, 'User found!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  async update(id: string, payload: UpdateUserDto) {
    try {
      const user = await this.userModel
        .findById(id)
        .where('isDeleted')
        .equals(false)
        .exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      const { password, ...rest } = payload;
      const hashedPassword = await hashPassword(password);

      await this.userModel
        .updateOne(
          {
            _id: id,
          },
          {
            ...rest,
            password: hashedPassword,
            updatedAt: moment(),
          },
        )
        .exec();

      return createTextResponse('User updated successfully!', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
