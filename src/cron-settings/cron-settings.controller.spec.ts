import { Test, TestingModule } from '@nestjs/testing';
import { CronSettingsController } from './cron-settings.controller';
import { CronSettingsService } from './cron-settings.service';

describe('CronSettingsController', () => {
  let controller: CronSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronSettingsController],
      providers: [CronSettingsService],
    }).compile();

    controller = module.get<CronSettingsController>(CronSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
