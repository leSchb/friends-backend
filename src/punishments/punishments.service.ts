import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Punishment } from './entities';
import { Repository } from 'typeorm';
import {
  CreatePunishmentDto,
  DeletePunishmentDto,
  UpdatePunishmentDto,
} from './dto';

@Injectable()
export class PunishmentsService {
  constructor(
    @InjectRepository(Punishment)
    private readonly punishmentRepo: Repository<Punishment>,
  ) {}

  async getPunishments() {
    const punishments = await this.punishmentRepo.find();
    return {
      message: 'Список наказаний успешно получен',
      success: true,
      data: punishments,
    };
  }

  async getPunishmentById(id: string) {
    const punishment = await this.punishmentRepo.findOneBy({ id });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    return {
      message: 'Наказание найдено',
      success: true,
      data: punishment,
    };
  }

  async deletePunishmentById({ uuid }: DeletePunishmentDto) {
    const punishment = await this.punishmentRepo.findOneBy({ id: uuid });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    await this.punishmentRepo.delete({ id: uuid });

    const deleted = { id: punishment.id, title: punishment.title };
    return {
      message: 'Наказание удалено',
      success: true,
      data: { deleted },
    };
  }

  async createPunishment(userId: string, dto: CreatePunishmentDto) {
    const punishment = this.punishmentRepo.create({
      ...dto,
      user: { id: userId },
    });
    await this.punishmentRepo.save(punishment);

    return {
      message: 'Наказание успешно создано',
      success: true,
      data: punishment,
    };
  }

  async updatePunishment(id: string, dto: UpdatePunishmentDto, userId: string) {
    const punishment = await this.punishmentRepo.findOneBy({ id });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    const isAuthor = punishment.user.id === userId;
    if (!isAuthor) throw new UnauthorizedException('Вы не автор наказания');

    await this.punishmentRepo.update({ id }, { ...dto });

    return {
      message: 'Наказание успешно обновлено',
      success: true,
      data: { updatedId: id },
    };
  }
}
