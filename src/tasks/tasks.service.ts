import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(authorId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { authorId },
    });
  }

  async create(data: CreateTaskDto, authorId: number) {
    console.log('Creating task with data:', data);
    if (!authorId) {
      throw new ForbiddenException('No authorId');
    }
    return await this.prisma.task.create({
      data: {
        ...data,
        authorId,
      },
    });
  }
}
