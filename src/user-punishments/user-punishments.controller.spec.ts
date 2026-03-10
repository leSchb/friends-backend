import { Test, TestingModule } from '@nestjs/testing';
import { UserPunishmentsController } from './user-punishments.controller';

describe('UserPunishmentsController', () => {
  let controller: UserPunishmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPunishmentsController],
    }).compile();

    controller = module.get<UserPunishmentsController>(
      UserPunishmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
