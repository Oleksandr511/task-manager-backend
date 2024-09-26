import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { Prisma, Task } from '@prisma/client';
import { Status } from 'src/enum/status.enum';
import { Priority } from 'src/enum/priority.enum';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(
    authorId: number,
    status?: Status,
    priority?: Priority,
  ): Promise<Task[]> {
    const obj: { status?: Status; priority?: Priority } = {
      status: status,
      priority: priority,
    };

    return this.prisma.task.findMany({
      where: {
        authorId,
        ...(obj && obj.status !== undefined && { status: obj.status }),
        ...(obj && obj.priority !== undefined && { priority: obj.priority }),
      },
    });
  }

  async create(data: CreateTaskDto, authorId: number): Promise<Task> {
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

  async update(
    data: UpdateTaskDto,
    authorId: number,
    id: number,
  ): Promise<Task> {
    if (!authorId) {
      throw new ForbiddenException('No authorId');
    }

    const task = await this.prisma.task.findUnique({
      where: { authorId, id: Number(id) },
    });

    if (!task) {
      throw new BadRequestException('No task found');
    }

    return await this.prisma.task.update({
      where: {
        authorId,
        id: Number(id),
      },
      data,
    });
  }

  async deleteTask(
    where: Prisma.TaskWhereUniqueInput,
  ): Promise<{ message: string }> {
    const task = await this.prisma.task.findUnique({ where });
    if (!task) {
      throw new NotFoundException(`Task with id ${where.id} not found.`);
    }
    await this.prisma.task.delete({
      where,
    });
    return {
      message: 'success',
    };
  }
}
