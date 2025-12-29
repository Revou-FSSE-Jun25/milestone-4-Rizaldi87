import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 1, description: 'ID of the user owning the account' })
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @ApiProperty({ example: 2, description: 'ID of the target account' })
  @IsNumber()
  @IsOptional()
  targetAccountId: number;

  @ApiProperty({ example: 250.75, description: 'Amount of the transaction' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'deposit', description: 'Type of the transaction' })
  @IsNotEmpty()
  @IsString()
  type: string;
}
