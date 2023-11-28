import { Controller, Get, Post, Body, Patch, Param, Delete, Query , UseGuards} from '@nestjs/common';
import { TagsService } from './tags.service'; 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.tagsService.findAll(Number(page) || 1, Number(limit) || 10, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
