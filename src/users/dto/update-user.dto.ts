import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'B7vFv@example.com',
    description: 'Email of the user',
  })
  @IsOptional()
  @IsString()
  email: string;
}
