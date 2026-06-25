import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManualCheckinDto {
  @ApiProperty({ description: 'The registration ID to manually check in' })
  @IsString()
  registrationId: string;
}
