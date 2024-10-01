import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Get('/profile/email')
  getProfileByEmail(@Body() email: string) {
    console.log(email);
    return this.usersService.getUserByEmail(email);
  }
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
