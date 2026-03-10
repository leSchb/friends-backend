import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Review } from 'src/reviews/entities';
import { RefreshToken } from 'src/auth/entities';
import { Punishment } from 'src/punishments/entities';
import { UserPunishment } from 'src/user-punishments/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => UserPunishment, (punishment) => punishment.user, {
    onDelete: 'CASCADE',
  })
  assignedPunishments: UserPunishment[];

  @OneToMany(() => Punishment, (punishment) => punishment.user, {
    onDelete: 'CASCADE',
  })
  createdPunishments: Punishment[];
}
