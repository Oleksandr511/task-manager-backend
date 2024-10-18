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
    console.log('here');
    console.log(req.user);
    return this.usersService.getUserById(req.user.sub);
  }
  @Get('/profile/email')
  getProfileByEmail(@Body() email: string) {
    console.log(email);
    return this.usersService.getUserByEmail(email);
  }
  @Get('profile/user')
  getUserProfile(@Request() req) {
    console.log('1');
    console.log(req.user);
    // return this.usersService.getUserByUser(user);
  }
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
