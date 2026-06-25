import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterEventDto {
  @ApiProperty({ description: 'The event ID to register for' })
  @IsString()
  eventId: string;

  @ApiPropertyOptional({ description: 'Optional ticket tier ID' })
  @IsOptional()
  @IsString()
  tierId?: string;

  @ApiPropertyOptional({
    description: 'Custom form fields (JSON object)',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;
}
