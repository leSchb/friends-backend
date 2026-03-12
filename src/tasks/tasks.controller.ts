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
    return this.tasksService.getTaskById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() { user },
  ) {
    return this.tasksService.updateTask(dto, id, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: string, @Request() { user }) {
    return this.tasksService.deleteTask(id, user.id);
  }
}
