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
    const token = request.cookies['token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user;
      return true;
    } catch (error) {
      console.log('e', error);
      throw new UnauthorizedException();
    }
  }
}
