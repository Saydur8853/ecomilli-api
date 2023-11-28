import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('v1/common')
export class CommonController {
  constructor(private readonly commonService: CommonService) { }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-states')
  findAll() {
    return this.commonService.findDashboardStats();
  }


}
