import { Max } from 'class-validator';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index(['title', 'description'], { unique: true })
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  @Max(5)
  severity: number;

  @ManyToOne(() => User, (user) => user.createdTasks)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
