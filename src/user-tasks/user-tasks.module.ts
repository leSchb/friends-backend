import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTasksController } from './user-tasks.controller';
import { UserTasksService } from './user-tasks.service';
import { UserTask } from './entities';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  controllers: [UserTasksController],
  providers: [UserTasksService],
  imports: [TypeOrmModule.forFeature([UserTask]), TasksModule],
})
export class UserTasksModule {}
