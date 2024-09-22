import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
