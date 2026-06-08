import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rohit Bhardwaj' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Passionate about tech and open source.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 2, description: 'Academic year (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  year?: number;

  @ApiPropertyOptional({
    example: ['web-dev', 'ml', 'design'],
    description: 'Interest tags for event recommendations',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
