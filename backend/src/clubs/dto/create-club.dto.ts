import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClubCategory } from '../../generated/prisma/enums';

export class CreateClubDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ enum: ClubCategory, required: false })
  @IsEnum(ClubCategory)
  @IsOptional()
  category?: ClubCategory;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  banner?: string;

  @ApiProperty()
  @IsString()
  collegeId: string;
}
