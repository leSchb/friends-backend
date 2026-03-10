import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Punishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  severity: number;

  @ManyToOne(() => User, (user) => user.createdPunishments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
