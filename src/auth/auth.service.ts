import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { LoginUserDto } from 'src/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const existUser = await this.usersService.getUserByEmail(userDto.email);
    if (existUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: userDto.email,
        password: hashPassword,
        name: userDto.name,
      },
    });
    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(id: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
      ),

      this.jwtService.signAsync(
        { sub: id, email },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const user = await this.prisma.user.findUnique({
        where: { id: Number(payload.sub) },
      });

      const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async deleteUser(id: number, req: Request) {
    const payload = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    if (!payload) {
      throw new UnauthorizedException('You are not authorized');
    }
    return await this.usersService.deleteUser(id);
  }
}
