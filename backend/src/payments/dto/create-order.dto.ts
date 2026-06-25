import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Registration ID to create a payment order for' })
  @IsString()
  registrationId: string;
}
