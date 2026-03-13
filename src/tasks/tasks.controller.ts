import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTask(@Body() dto: CreateTaskDto, @Request() { user }) {
    return this.tasksService.createTask(dto, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTaskById(@Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);
    return {
      message: 'Задача найдена',
      data: task,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() { user },
  ) {
    const task = await this.tasksService.updateTask(dto, id, user.id);
    return {
      message: 'Задача успешно обновлена',
      data: task,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: string, @Request() { user }) {
    const task = await this.tasksService.getTaskById(id);
    return {
      message: 'Задача успешно удалена',
      data: task,
    };
  }
}
