import { IsString, IsEnum, IsOptional, IsUrl, IsDate, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventType, ClubCategory } from '../../generated/prisma/enums';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: EventType, required: false })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @ApiProperty()
  @IsString()
  clubId: string;

  @ApiProperty()
  @IsDate()
  startAt: Date;

  @ApiProperty()
  @IsDate()
  endAt: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  meetingLink?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ enum: ClubCategory, required: false })
  @IsEnum(ClubCategory)
  @IsOptional()
  category?: ClubCategory;
}
