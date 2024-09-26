import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  Request,
  InternalServerErrorException,
  UnauthorizedException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

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
  ): Promise<{ message: string }> {
    const data = await this.authService.registration(userDto);
    response.cookie('token', data.token, { httpOnly: true });
    return {
      message: 'success user registered',
    };
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const token = await this.authService.login(loginDto);
    response.cookie('token', token, { httpOnly: true });
    return {
      message: 'success',
    };
  }

  @Post('/logout')
  async logout(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const token = req.cookies['token'];
    if (!token) {
      throw new UnauthorizedException(
        'Token not found. You are already logged out.',
      );
    }
    try {
      response.clearCookie('token', { httpOnly: true });
    } catch (error) {
      throw new InternalServerErrorException('You can`t log out', error);
    }
    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/user')
  async deleteUser(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.deleteUser(req.user.id);
    await this.logout(req, response);
    return {
      massage: 'success',
    };
  }
}
