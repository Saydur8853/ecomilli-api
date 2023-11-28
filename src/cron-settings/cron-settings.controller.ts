import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CronSettingsService } from './cron-settings.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCronSettingsDto } from './dto/create-cron-settings.dto';
import { UpdateCronSettingsDto } from './dto/update-cron-settings.dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('v1/cron-settings')
export class CronSettingsController {
  constructor(private readonly cronSettingsService: CronSettingsService) { }

  @Post()
  create(@Body() createCronSettingDto: CreateCronSettingsDto, @Req() req: Request) {
    return this.cronSettingsService.addCronJob(createCronSettingDto, req.user);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.cronSettingsService.findAlljobs(Number(page) || 1, Number(limit) || 10, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cronSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCronSettingDto: UpdateCronSettingsDto) {
    return this.cronSettingsService.update(+id, updateCronSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cronSettingsService.remove(+id);
  }
}
