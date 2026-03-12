import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PunishmentsModule } from './punishments/punishments.module';
import { UserPunishmentsModule } from './user-punishments/user-punishments.module';
import { TasksModule } from './tasks/tasks.module';
import { UserTasksModule } from './user-tasks/user-tasks.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.PROJECT_ENV === 'dev',
    }),
    PunishmentsModule,
    UserPunishmentsModule,
    TasksModule,
    UserTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
