import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { UserPunishment } from './entities';
import { Punishment } from 'src/punishments/entities';

@Injectable()
export class UserPunishmentsService {
  constructor(
    private readonly userPunishmentRepo: Repository<UserPunishment>,
    private readonly punishmentRepo: Repository<Punishment>,
  ) {}

  async assignRandomPunishment(userId: string) {
    const punishments = await this.punishmentRepo.find();
    if (!punishments.length)
      throw new NotFoundException('Нет доступных наказаний');

    const randomIndex = Math.floor(Math.random() * punishments.length);
    const random = punishments[randomIndex];

    const userPunishment = this.userPunishmentRepo.create({
      user: { id: userId },
      punishment: random,
      completed: false,
    });

    await this.userPunishmentRepo.save(userPunishment);

    return {
      message: 'Случайное наказание выдано пользователю',
      success: true,
      data: userPunishment,
    };
  }

  async getUserPunishments(userId: string) {
    const punishments = await this.userPunishmentRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['punishment'],
    });

    return {
      message: 'Список наказаний получен',
      success: true,
      data: punishments,
    };
  }
}
