import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserPunishmentsService } from './user-punishments.service';
import { Repository } from 'typeorm';
import { UserPunishment } from './entities';
import { Punishment } from 'src/punishments/entities';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UserPunishmentsService', () => {
  let service: UserPunishmentsService;
  let userPunishmentRepo: MockProxy<Repository<UserPunishment>>;
  let punishmentRepo: MockProxy<Repository<Punishment>>;

  beforeEach(async () => {
    // создаём моки через jest-mock-extended
    userPunishmentRepo = mock<Repository<UserPunishment>>();
    punishmentRepo = mock<Repository<Punishment>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPunishmentsService,
        { provide: 'userPunishmentRepo', useValue: userPunishmentRepo },
        { provide: 'punishmentRepo', useValue: punishmentRepo },
      ],
    }).compile();

    service = module.get<UserPunishmentsService>(UserPunishmentsService);
  });

  it('assignRandomPunishment — выдаёт наказание', async () => {
    const punishments = [{ id: 'p1', title: 'Test' }] as Punishment[];
    punishmentRepo.find.mockResolvedValue(punishments);

    const created = {
      punishment: punishments[0],
      completed: false,
    } as UserPunishment;
    userPunishmentRepo.create.mockReturnValue(created);
    userPunishmentRepo.save.mockResolvedValue(created);

    const result = await service.assignRandomPunishment('user1');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(created);
    expect(userPunishmentRepo.create).toHaveBeenCalledWith({
      user: { id: 'user1' },
      punishment: punishments[0],
      completed: false,
    });
    expect(userPunishmentRepo.save).toHaveBeenCalledWith(created);
  });

  it('assignRandomPunishment — выбрасывает NotFoundException если нет наказаний', async () => {
    punishmentRepo.find.mockResolvedValue([]);

    await expect(service.assignRandomPunishment('user1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('getUserPunishments — возвращает список', async () => {
    const userPunishments = [
      { id: 'up1', completed: false },
    ] as UserPunishment[];
    userPunishmentRepo.find.mockResolvedValue(userPunishments);

    const result = await service.getUserPunishments('user1');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(userPunishments);
    expect(userPunishmentRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 'user1' } },
      relations: ['punishment'],
    });
  });
});
