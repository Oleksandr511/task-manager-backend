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
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from 'src/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private setCookie(res, name, value, options) {
    res.cookie(name, value, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: true,
      ...options,
    });
  }
  @Post('register')
  async registration(
    @Body() userDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.registration(userDto);
      return {
        message: 'success registration',
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new UnauthorizedException('Email already exists');
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(loginDto);
      console.log(tokens);
      this.setCookie(res, 'accessToken', tokens.accessToken, {
        expiresIn: '15m',
      });
      this.setCookie(res, 'refreshToken', tokens.refreshToken, {
        expiresIn: '30d',
      });
      return res.send({ message: 'success login' });
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Post('refresh')
  async refresh(@Request() req, @Res() res: Response) {
    try {
      const tokens = await this.authService.refreshToken(
        req.cookies.refreshToken,
      );
      this.setCookie(res, 'accessToken', tokens.accessToken, {
        expiresIn: '15m',
      });
      this.setCookie(res, 'refreshToken', tokens.refreshToken, {
        expiresIn: '30d',
      });
      res.send({ message: 'success refresh' });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    try {
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      return {
        message: 'success',
      };
    } catch (error) {
      throw new InternalServerErrorException('You can`t log out', error);
    }
  }

  // @UseGuards(AuthGuard)
  @Delete('/user/:id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    await this.authService.deleteUser(Number(id), req);
    // await this.logout();
    return {
      massage: 'success',
    };
  }
}
