import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
     if (!createUserDto.password) {
       throw new Error('Password is required');
     }
     
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // async login(username: string, password: string): Promise<string> {
  //   const user = await this.userModel.findOne({ username }).exec();
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const token = jwt.sign(
  //     { userId: user._id, username },
  //     'this-is-my-secret',
  //     {
  //       expiresIn: '1h',
  //     },
  //   );
  //   return token;
  // }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
