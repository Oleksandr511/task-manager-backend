import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @ApiCreatedResponse({
    description: 'success user registered',
  })
  @ApiBadRequestResponse({
    description: 'Email already exists',
  })
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.registration(userDto);
    response.cookie('token', data.token, { httpOnly: true });
    return {
      message: 'success user registered',
    };
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(loginDto);
    response.cookie('token', token, { httpOnly: true });
    return {
      message: 'success',
    };
  }
}
