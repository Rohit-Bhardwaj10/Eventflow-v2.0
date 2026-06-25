import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-description')
  @ApiOperation({ summary: 'Generate an event description using AI' })
  generateDescription(
    @CurrentUser('id') userId: string,
    @Body('title') title: string,
    @Body('category') category: string,
    @Body('additionalContext') additionalContext?: string,
  ) {
    return this.aiService.generateEventDescription(title, category, additionalContext);
  }
}
