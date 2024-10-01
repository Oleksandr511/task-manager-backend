import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    const accessToken = request.cookies.accessToken;

    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      request.user = user;
      return true;
    } catch (accessTokenError) {
      try {
        const user = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        });
        request.user = user;
        return true;
      } catch (refreshTokenError) {
        console.log(refreshTokenError);
        throw new UnauthorizedException();
      }
    }
  }
}
