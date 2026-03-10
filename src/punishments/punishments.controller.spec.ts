import { Test, TestingModule } from '@nestjs/testing';
import { PunishmentsController } from './punishments.controller';

describe('PunishmentsController', () => {
  let controller: PunishmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PunishmentsController],
    }).compile();

    controller = module.get<PunishmentsController>(PunishmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
