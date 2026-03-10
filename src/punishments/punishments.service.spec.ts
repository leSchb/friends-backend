import { Test, TestingModule } from '@nestjs/testing';
import { PunishmentsService } from './punishments.service';

describe('PunishmentsService', () => {
  let service: PunishmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PunishmentsService],
    }).compile();

    service = module.get<PunishmentsService>(PunishmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
