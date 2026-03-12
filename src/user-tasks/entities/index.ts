import { Task } from 'src/tasks/entities';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User, (user) => user.tasksToComplete)
  user: User;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp' })
  completedAt: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
