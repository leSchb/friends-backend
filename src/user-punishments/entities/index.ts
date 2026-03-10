import { Punishment } from 'src/punishments/entities';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserPunishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.assignedPunishments)
  user: User;

  @ManyToOne(() => Punishment)
  punishment: Punishment;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  completed: boolean;
}
