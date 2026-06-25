import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Global search for events and clubs' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  globalSearch(@Query('q') q: string) {
    return this.searchService.globalSearch(q || '');
  }
}
