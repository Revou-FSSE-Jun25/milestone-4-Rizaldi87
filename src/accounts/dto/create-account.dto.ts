import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: '123456', description: 'Unique account number' })
  @IsString()
  @Length(6, 6)
  accountNumber: string;

  @ApiProperty({ example: 1, description: 'ID of the user owning the account' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 1000.5,
    description: 'Initial balance of the account',
  })
  @IsNumber()
  balance: number;

  @ApiProperty({ example: 'savings', description: 'Type of the account' })
  @IsString()
  type: AccountType;
}
