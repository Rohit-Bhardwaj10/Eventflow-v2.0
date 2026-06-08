import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'rohit@college.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Rohit Bhardwaj' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'StrongPass@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 2, description: 'Academic year (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  year?: number;
}
