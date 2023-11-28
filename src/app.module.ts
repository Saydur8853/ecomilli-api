import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { InfobitesModule } from './infobites/infobites.module';
import { CronSettingsModule } from './cron-settings/cron-settings.module';
import { NewsModule } from './news/news.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    CronSettingsModule,
    DatabaseModule,
    RolesModule,
    UsersModule,
    CategoriesModule,
    InfobitesModule,
    NewsModule,
    TagsModule,
    AuthModule,
    CommentsModule,
    EmailModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
