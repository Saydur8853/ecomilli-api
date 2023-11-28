import { Module } from '@nestjs/common';
import { InfobitesService } from './infobites.service';
import { InfobitesController } from './infobites.controller';

@Module({
  controllers: [InfobitesController],
  providers: [InfobitesService],
})
export class InfobitesModule {}
