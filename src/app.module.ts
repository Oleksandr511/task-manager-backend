import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class AppModule {}
