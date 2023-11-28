import { Test, TestingModule } from '@nestjs/testing';
import { InfobitesController } from './infobites.controller';
import { InfobitesService } from './infobites.service';

describe('InfobitesController', () => {
  let controller: InfobitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfobitesController],
      providers: [InfobitesService],
    }).compile();

    controller = module.get<InfobitesController>(InfobitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
