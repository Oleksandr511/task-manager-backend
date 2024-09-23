import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    PrismaService,
    JwtService,
    AuthService,
    UsersService,
  ],
  imports: [AuthModule],
})
export class TasksModule {}
