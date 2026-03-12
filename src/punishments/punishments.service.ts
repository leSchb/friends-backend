import {
  ConflictException,
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
      data: punishments,
    };
  }

  async getPunishmentById(id: string) {
    const punishment = await this.punishmentRepo.findOneBy({ id });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    return {
      message: 'Наказание найдено',
      data: punishment,
    };
  }

  async deletePunishmentById({ uuid }: DeletePunishmentDto) {
    const punishment = await this.punishmentRepo.findOneBy({ id: uuid });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    await this.punishmentRepo.update(
      { id: punishment.id },
      { isDeleted: true },
    );

    const deleted = { id: punishment.id, title: punishment.title };
    return {
      message: 'Наказание удалено',
      data: { deleted },
    };
  }

  async createPunishment(userId: string, dto: CreatePunishmentDto) {
    const exists = await this.punishmentRepo.findOneBy({ ...dto });
    if (exists) throw new ConflictException('Такое наказание уже существует');

    const punishment = this.punishmentRepo.create({
      ...dto,
      creator: { id: userId },
    });
    await this.punishmentRepo.save(punishment);

    return {
      message: 'Наказание успешно создано',
      data: punishment,
    };
  }

  async updatePunishment(id: string, dto: UpdatePunishmentDto, userId: string) {
    const punishment = await this.punishmentRepo.findOneBy({ id });
    if (!punishment)
      throw new NotFoundException('Такого наказания не существует');

    const isCreator = punishment.creator.id === userId;
    if (!isCreator) throw new UnauthorizedException('Вы не автор наказания');

    await this.punishmentRepo.update({ id }, { ...dto });

    return {
      message: 'Наказание успешно обновлено',
      data: { updatedId: id },
    };
  }
}
