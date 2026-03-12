import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task } from './entities';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
  ) {}

  private async findTaskById(id: string) {
    const task = await this.tasksRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['creator'],
    });
    return task;
  }

  async createTask(dto: CreateTaskDto, creatorId: string) {
    const task = this.tasksRepo.create({
      ...dto,
      creator: { id: creatorId },
    });

    await this.tasksRepo.save(task);
    return {
      message: 'Задача успешно создана',
      data: { created: task },
    };
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.findTaskById(taskId);
    if (!task) throw new NotFoundException('Задача не найдена');

    if (task.creator.id !== userId)
      throw new UnauthorizedException('Вы не можете удалить эту задачу');

    task.isDeleted = true;
    await this.tasksRepo.save(task);

    return {
      message: 'Задача успешно удалена',
    };
  }

  async updateTask(dto: UpdateTaskDto, taskId: string, userId: string) {
    const task = await this.findTaskById(taskId);
    if (!task) throw new NotFoundException('Задача не найдена');

    if (task.creator.id !== userId)
      throw new UnauthorizedException('Вы не автор этой задачи');

    Object.assign(task, dto);
    await this.tasksRepo.save(task);

    return {
      message: 'Задача успешно обновлена',
      data: { updated: task },
    };
  }

  async getTaskById(id: string) {
    const task = await this.findTaskById(id);
    if (!task) throw new NotFoundException('Задача не найдена');

    return {
      message: 'Задача найдена',
      data: task,
    };
  }
}
