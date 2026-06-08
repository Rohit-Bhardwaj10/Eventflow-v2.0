import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'rohit@college.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass@123' })
  @IsString()
  @MinLength(8)
  password: string;
}
