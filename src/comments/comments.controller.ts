import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('comments')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('comments')
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.commentsService.findAll(Number(page) || 1, Number(limit) || 10, query);
  }

  @Patch('categories/status-update/:id')
  statusUpdateOne(@Param('id') id: string, @Body() updateStatus: StatusUpdate) {
    return this.commentsService.statusUpdateOne(+id, updateStatus);
  }


  @Get('comments/:id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch('comments/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete('comments/:id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
