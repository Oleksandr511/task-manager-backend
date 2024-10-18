import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { AuthService } from 'src/auth/auth.service';

import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { GetTaskFilterDto } from 'src/dto/task-filter.dto';
import { Task } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private authService: AuthService,
  ) {}

  @Get()
  async getUserTasks(
    @Query(new ValidationPipe({ transform: true })) filterDto: GetTaskFilterDto,
    @Request() req,
  ): Promise<Task[]> {
    const authorId = req.user.sub;
    if (!authorId) {
      throw new UnauthorizedException('Not authorized');
    }
    // const payload = jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);

    // const authorId = payload.sub;
    console.log('get tasks');
    return this.tasksService.getTasks(
      Number(authorId),
      filterDto.status,
      filterDto.priority,
    );
  }

  @Post('new')
  async create(
    @Request() req,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    // if (req.cookies.accessToken === undefined) {
    //   throw new UnauthorizedException('Not authorized');
    // }
    // const at = req.cookies.accessToken;
    // console.log('at', at);
    // console.log(req)
    // const payload = jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);
    // console.log(payload);
    // const authorId = payload.sub;
    const authorId = req.user.sub;

    return this.tasksService.create({ ...createTaskDto }, Number(authorId));
  }

  @Put('/update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Body() data: UpdateTaskDto,
    @Param('id') id: number,
    @Request() req,
  ) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Something went wrong');
    }
    // const token = req.headers.accessToken;
    // if (!token) {
    //   throw new ForbiddenException('Not authorized');
    // }
    try {
      // const at = req.cookies.accessToken;
      // const payload = jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);
      const authorId = req.user.sub;

      return this.tasksService.update(data, Number(authorId), id);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
    await this.tasksService.deleteTask({ id: Number(id) });
    return {
      message: 'success',
    };
  }
}
