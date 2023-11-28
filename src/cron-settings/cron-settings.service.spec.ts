import { Test, TestingModule } from '@nestjs/testing';
import { CronSettingsService } from './cron-settings.service';

describe('CronSettingsService', () => {
  let service: CronSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronSettingsService],
    }).compile();

    service = module.get<CronSettingsService>(CronSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
