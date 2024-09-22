import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService],
  imports: [AuthModule],
})
export class UsersModule {}
