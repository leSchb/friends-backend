import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserTask } from './entities';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateUserTaskDto } from './dto';

@Injectable()
export class UserTasksService {
  constructor(
    @InjectRepository(UserTask)
    private readonly userTasksRepository: Repository<UserTask>,
    private readonly tasksService: TasksService,
  ) {}

  async getTasksForUser(userId: string) {
    const userTasks = await this.userTasksRepository.find({
      where: { user: { id: userId } },
      relations: {
        task: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return userTasks;
  }

  async getTaskById(id: string) {
    const task = await this.userTasksRepository.findOne({
      where: { id },
      relations: {
        task: true,
      },
    });

    if (!task) throw new NotFoundException('Задача не найдена');

    return task;
  }

  async createTask(userId: string, dto: CreateUserTaskDto) {
    const exists = await this.tasksService.getTaskByDto(dto);

    let task = exists;

    if (!task) {
      task = await this.tasksService.createTask(dto, userId);
    }

    const userTask = this.userTasksRepository.create({
      user: { id: userId },
      task,
    });

    await this.userTasksRepository.save(userTask);

    return userTask;
  }

  async completeTask(userId: string, taskId: string) {
    const result = await this.userTasksRepository.update(
      {
        id: taskId,
        user: { id: userId },
        isCompleted: false,
      },
      {
        isCompleted: true,
        completedAt: new Date(),
      },
    );
    if (!result.affected) {
      throw new NotFoundException('Задача не найдена');
    }
  }
}
