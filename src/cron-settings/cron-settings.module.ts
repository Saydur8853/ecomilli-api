import { Module } from '@nestjs/common';
import { CronSettingsService } from './cron-settings.service';
import { CronSettingsController } from './cron-settings.controller';

@Module({
  controllers: [CronSettingsController],
  providers: [CronSettingsService],
})
export class CronSettingsModule {}
