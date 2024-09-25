import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { AuthService } from 'src/auth/auth.service';

import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { GetTaskFilterDto } from 'src/dto/task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private authService: AuthService,
  ) {}

  @Get()
  async getUserTasks(
    @Query(new ValidationPipe({ transform: true })) filterDto: GetTaskFilterDto,
    @Request() req,
  ) {
    const token = req.cookies.token;
    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const decodedToken = await this.authService.decorateToken(token);
    console.log(decodedToken);
    const authorId = decodedToken['id'];

    return this.tasksService.getTasks(
      authorId,
      filterDto.status,
      filterDto.priority,
    );
  }

  @Post('/new')
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const token = req.cookies.token;
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    const decodedToken = await this.authService.decorateToken(token);
    console.log(decodedToken);
    const authorId = decodedToken['id'];

    return this.tasksService.create({ ...createTaskDto }, authorId);
  }

  @Post('/update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Body() data: UpdateTaskDto,
    @Param('id') id: number,
    @Request() req,
  ) {
    console.log(data);
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Something went wrong');
    }
    const token = req.cookies.token;
    if (!token) {
      throw new ForbiddenException('Not authorized');
    }
    const decodedToken = await this.authService.decorateToken(token);
    console.log(decodedToken);
    const authorId = decodedToken['id'];

    return this.tasksService.update(data, authorId, id);
  }
}
