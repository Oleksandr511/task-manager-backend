import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('user')
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }
}
