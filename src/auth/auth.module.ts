import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
