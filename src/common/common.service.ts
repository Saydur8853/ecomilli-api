import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CustomResponse } from 'src/shared/responses/CustomResponse';

@Injectable()
export class CommonService {
  constructor(
    private readonly databaseService: DatabaseService
  ) { }

  async findDashboardStats() {
    const newsTotal = await this.databaseService.news.aggregate({
      _sum: {
        viewCount: true,
        shareCount: true,
        id: true
      },
    });

    const totalInfobites = await this.databaseService.infobite.count();

    const response = {
      totalNews: newsTotal._sum.id || 0,
      totalViews: newsTotal._sum.viewCount || 0,
      totalShares: newsTotal._sum.shareCount || 0,
      totalClips: 0,
      totalVideos: 0,
      totalInfobites,
    };

    return new CustomResponse(true, "Stats Found!", response);

  }


}
