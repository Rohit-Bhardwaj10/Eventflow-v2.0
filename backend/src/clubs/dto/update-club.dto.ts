import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClubStatus } from '../../generated/prisma/enums';

export class UpdateClubDto extends PartialType(CreateClubDto) {
  @ApiProperty({ enum: ClubStatus, required: false })
  @IsEnum(ClubStatus)
  @IsOptional()
  status?: ClubStatus;
}
