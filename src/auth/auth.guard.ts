import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    const refreshToken = request.headers['refreshtoken'];
    const accessToken = request.headers['accesstoken'];

    console.log('refreshToken 2', refreshToken);
    console.log('accessToken 2', accessToken);
    if (!refreshToken && !accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      request.user = user;
      console.log('try access token');
      return true;
    } catch {
      try {
        const user = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        });
        request.user = user;
        const newAccessToken = await this.jwtService.signAsync(
          { sub: user.sub, email: user.email },
          { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
        );
        response.setHeader('accesstoken', newAccessToken);

        console.log('newAccessToken', newAccessToken);
        console.log('try refresh token');
        return true;
      } catch (refreshTokenError) {
        console.log('this is the error');
        console.log(refreshTokenError);
        throw new UnauthorizedException();
      }
    }
  }
}
