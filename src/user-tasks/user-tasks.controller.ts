import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserTasksService } from './user-tasks.service';
import { CreateUserTaskDto } from './dto';

@Controller('user-tasks')
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyTasks(@Req() { user }) {
    const userTasks = await this.userTasksService.getTasksForUser(user.id);
    return {
      message: 'Задачи пользователя получены',
      data: userTasks,
    };
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    const task = await this.userTasksService.getTaskById(id);
    return {
      message: 'Задача найдена',
      data: task,
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Req() { user }, @Body() dto: CreateUserTaskDto) {
    const task = await this.userTasksService.createTask(user.id, dto);
    return {
      message: 'Задача успешно создана',
      data: task,
    };
  }

  @Post('complete/:id')
  @UseGuards(JwtAuthGuard)
  async completeTask(@Req() { user }, @Param('id') id: string) {
    const task = await this.userTasksService.completeTask(user.id, id);
    return {
      message: 'Задача успешно выполнена',
      data: task,
    };
  }
}
