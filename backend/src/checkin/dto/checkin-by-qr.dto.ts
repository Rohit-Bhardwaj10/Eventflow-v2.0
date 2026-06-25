import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckinByQrDto {
  @ApiProperty({ description: 'The QR token scanned from the attendee ticket' })
  @IsString()
  qrToken: string;

  @ApiPropertyOptional({
    description: 'Check-in method: QR (default) or MANUAL',
    enum: ['QR', 'MANUAL'],
  })
  @IsOptional()
  @IsIn(['QR', 'MANUAL'])
  method?: 'QR' | 'MANUAL';
}
