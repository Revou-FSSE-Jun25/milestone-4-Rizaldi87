import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transactions Endpoints')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Deposit money into an account' })
  @ApiAcceptedResponse({ description: 'The deposit has been made.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Post('deposit')
  deposit(@Req() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionsService.deposit(
      req.user.userId,
      body.accountId,
      body.amount,
    );
  }

  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiAcceptedResponse({ description: 'The withdrawal has been made.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Post('withdraw')
  withdraw(@Req() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionsService.withdraw(
      req.user.userId,
      body.accountId,
      body.amount,
    );
  }

  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiAcceptedResponse({ description: 'The transfer has been made.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Post('transfer')
  transfer(
    @Req() req,
    @Body()
    body: { accountId: number; amount: number; targetAccountId: number },
  ) {
    return this.transactionsService.tranfer(
      req.user.userId,
      body.accountId,
      body.amount,
      body.targetAccountId,
    );
  }

  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiAcceptedResponse({ description: 'The transactions have been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Get()
  findAll(@Req() req) {
    return this.transactionsService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Get transaction by ID for a user' })
  @ApiAcceptedResponse({ description: 'The transaction has been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOneByUser(req.user.userId, +id);
  }
}
