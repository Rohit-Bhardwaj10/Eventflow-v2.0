import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
    } else {
      this.logger.warn('GROQ_API_KEY is not configured. AI features will be disabled.');
    }
  }

  async generateEventDescription(title: string, category: string, additionalContext?: string) {
    if (!this.groq) {
      throw new BadRequestException('AI features are not configured');
    }

    try {
      const prompt = `You are an expert event copywriter. Write an engaging and professional event description for an event titled "${title}" in the category "${category}". ${additionalContext ? 'Additional context: ' + additionalContext : ''}\n\nProvide only the description text. Keep it around 2-3 paragraphs.`;

      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
      });

      return { description: response.choices[0]?.message?.content?.trim() || '' };
    } catch (error) {
      this.logger.error('Failed to generate event description', error);
      throw new BadRequestException('Failed to generate description from AI service');
    }
  }
}
