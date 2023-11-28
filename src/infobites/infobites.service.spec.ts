import { Test, TestingModule } from '@nestjs/testing';
import { InfobitesService } from './infobites.service';

describe('InfobitesService', () => {
  let service: InfobitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfobitesService],
    }).compile();

    service = module.get<InfobitesService>(InfobitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
