import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User } from '@prisma/client';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 12);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    delete user.password;
    return { ...user, token: this.generateToken(user) };
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      delete user.password;
      const token = this.generateToken(user);
      return token;
    }
    throw new UnauthorizedException({ message: 'Uncorrect email or password' });
  }

  async decorateToken(token: string): Promise<JwtPayload> {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken as JwtPayload;
  }
}
