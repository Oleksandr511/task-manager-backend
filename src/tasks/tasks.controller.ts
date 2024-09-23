import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private authService: AuthService,
  ) {}

  @Get()
  async getUserTasks(@Request() req) {
    const token = req.cookies.token;
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    const decodedToken = await this.authService.decorateToken(token);
    console.log(decodedToken);
    const authorId = decodedToken['id'];

    return this.tasksService.getTasks(authorId);
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
}
